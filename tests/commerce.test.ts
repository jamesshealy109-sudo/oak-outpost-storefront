import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProduct, normalizeCart, FourthwallProvider, CommerceError } from '../lib/commerce/fourthwall';
import { selectionItems, validateQuantity, validCartId, bundlePrice, stripHtml } from '../lib/commerce/validation';

const id = '11111111-1111-4111-8111-111111111111';
const variant = (vid = id, value = 24.99, stock = 'UNLIMITED') => ({ id:vid, name:'Oak &amp; Outpost - Green, M', unitPrice:{value,currency:'USD'}, attributes:{description:'Green, M',color:{name:'Green',swatch:'#123a2b'},size:{name:'M'}},stock:{type:stock},images:[] });
const raw = {type:'PRODUCT',id:'tee',name:'Oak &amp; Outpost Tee',slug:'oak-tee',description:'<p>A real <strong>tee</strong>.</p>',state:{type:'AVAILABLE'},images:[{url:'https://example.com/tee.webp'}],variants:[variant()],additionalInformation:[]};

test('maps provider money, exact variants, options, availability and decoded names',()=>{
 const p=normalizeProduct(raw);
 assert.equal(p.name,'Oak & Outpost Tee'); assert.equal(p.price?.value,24.99);
 assert.equal(p.variants[0].id,id); assert.equal(p.variants[0].color,'Green'); assert.equal(p.variants[0].size,'M');
 assert.equal(p.available,true); assert.equal(p.description,'A real tee.');
});
test('sold-out variants and unavailable products cannot be purchased',()=>{
 const p=normalizeProduct({...raw,variants:[variant(id,24.99,'OUT_OF_STOCK')]});
 assert.throws(()=>selectionItems(p,[id],1),/unavailable/i);
 assert.throws(()=>selectionItems(normalizeProduct({...raw,state:{type:'SOLD_OUT'}}),[id],1),/unavailable/i);
});
test('quantities reject fractional, nonnumeric, zero, negative, and excessive input',()=>{
 for(const q of [0,-1,1.5,1001,'2',null]) assert.throws(()=>validateQuantity(q));
 assert.equal(validateQuantity(2),2);
});
test('variant selections must belong to the selected product',()=>{
 assert.throws(()=>selectionItems(normalizeProduct(raw),['unknown'],1),/selection/i);
 assert.deepEqual(selectionItems(normalizeProduct(raw),[id],2),[{variantId:id,quantity:2}]);
});
test('bundles require exactly one eligible selection for every included product',()=>{
 const second='22222222-2222-4222-8222-222222222222';
 const bundle=normalizeProduct({type:'BUNDLE',id:'bundle',name:'Fall',slug:'fall',state:{type:'AVAILABLE'},price:{value:30,currency:'USD'},pricingStrategy:{type:'DISCOUNT_BASED',discountPercentage:10},offers:[raw,{...raw,id:'hat',variants:[variant(second,10)]}]});
 assert.throws(()=>selectionItems(bundle,[id],1),/selection/i);
 assert.throws(()=>selectionItems(bundle,[id,id],1),/selection/i);
 assert.deepEqual(selectionItems(bundle,[id,second],1),[{variantId:id,quantity:1,bundleId:'bundle'},{variantId:second,quantity:1,bundleId:'bundle'}]);
 assert.equal(bundlePrice(bundle,[id,second]).value,31.49);
});
test('cart normalization uses provider prices and keeps bundles together',()=>{
 const p=normalizeProduct(raw);
 const cart=normalizeCart({id,items:[{quantity:2,variant:{...variant(),product:{id:'tee',slug:'oak-tee',name:'Oak Tee'}}}]},[p],'oak-outpost-llc-shop.fourthwall.com');
 assert.equal(cart.subtotal.value,49.98); assert.equal(cart.lines[0].quantity,2);
 assert.equal(new URL(cart.checkoutUrl).hostname,'oak-outpost-llc-shop.fourthwall.com');
});
test('corrupt persisted cart IDs fail closed',()=>{
 for(const value of [undefined,'','../cart','<script>','bad-id']) assert.equal(validCartId(value),false);
 assert.equal(validCartId(id),true);
});
test('product text is displayed as text without executing embedded markup',()=>{
 assert.equal(stripHtml('<p>Oak &amp; Outpost</p><script>alert(1)</script>'),'Oak & Outpost');
});
test('provider rejection and timeout surface an actionable error without leaking credentials',async()=>{
 const provider=new FourthwallProvider({token:'secret-catalog-token',domain:'oak-outpost-llc-shop.fourthwall.com',fetcher:async()=>new Response('{"code":"CART_QUANTITY_TOO_HIGH"}',{status:400})});
 await assert.rejects(()=>provider.getCart(id),(error:unknown)=>error instanceof CommerceError && error.message.includes('quantity') && !error.message.includes('secret'));
 const offline=new FourthwallProvider({token:'secret',domain:'oak-outpost-llc-shop.fourthwall.com',fetcher:async()=>{throw new TypeError('fetch failed with secret');}});
 await assert.rejects(()=>offline.listProducts(),/try again/i);
});
test('checkout URLs reject untrusted origins and malformed cart IDs',()=>{
 const provider=new FourthwallProvider({token:'test',domain:'oak-outpost-llc-shop.fourthwall.com'});
 assert.throws(()=>provider.checkoutUrl('../unsafe'));
 assert.throws(()=>new FourthwallProvider({token:'test',domain:'evil.example/path?redirect=1'}));
 assert.equal(new URL(provider.checkoutUrl(id)).searchParams.get('cartCurrency'),'USD');
});
