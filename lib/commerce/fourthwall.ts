import type {Cart,CartItemInput,CartLine,CommerceProvider,Money,Product,Variant} from './types';
import {bundlePrice,stripHtml,validCartId} from './validation';
type RawImage={url:string};
type RawVariant={id:string;name:string;unitPrice:Money;attributes?:{description?:string;color?:{name:string;swatch:string};size?:{name:string}};stock?:{type:string;quantity?:number};images?:RawImage[]};
type RawProduct={id:string;name:string;slug:string;description?:string;type?:string;state?:{type:string};images?:RawImage[];variants?:RawVariant[];price?:Money;offers?:RawProduct[];additionalInformation?:{title:string;bodyHtml:string}[]|null;pricingStrategy?:Product['pricingStrategy']};
type RawCartItem={quantity:number;variant:RawVariant&{product:{id:string;slug:string;name:string}};groupedBy?:{type:string;bundleId:string;groupedId:string}};
type RawCart={id:string;items:RawCartItem[]};
export class CommerceError extends Error {constructor(message:string,public status=502,public code='PROVIDER_ERROR'){super(message);this.name='CommerceError';}}
export function normalizeProduct(raw:RawProduct):Product {
 const name=stripHtml(raw.name);
 const variants:Variant[]=(raw.variants??[]).map(v=>({id:v.id,name:stripHtml(v.name),description:stripHtml(v.attributes?.description??''),price:v.unitPrice,color:v.attributes?.color?.name??'',swatch:v.attributes?.color?.swatch??'',size:v.attributes?.size?.name??'',available:!!v.unitPrice&&v.stock?.type!=='OUT_OF_STOCK'&&v.stock?.type!=='SOLD_OUT'&&(v.stock?.type!=='LIMITED'||(v.stock.quantity??0)>0),stock:v.stock?.type==='LIMITED'?(v.stock.quantity??0):null,image:v.images?.[0]?{url:v.images[0].url,alt:name}:null}));
 const offers=(raw.offers??[]).map(normalizeProduct);
 const price=raw.type==='BUNDLE'?(raw.price??null):(variants.length?variants.reduce((best,v)=>v.price.value<best.value?v.price:best,variants[0].price):null);
 const category=raw.type==='BUNDLE'?'Bundles':/hoodie/i.test(name)?'Layers':/long sleeve/i.test(name)?'Long sleeves':/tee|shirt/i.test(name)?'T-shirts':/hat/i.test(name)?'Headwear':'Accessories';
 return {id:raw.id,slug:raw.slug,name,description:stripHtml(raw.description??''),images:[...new Set((raw.images??[]).map(i=>i.url).filter(u=>/^https:\/\//.test(u)))].slice(0,14).map(url=>({url,alt:name})),variants,price,available:raw.state?.type==='AVAILABLE'&&(raw.type==='BUNDLE'?offers.length>0&&offers.every(p=>p.available):variants.some(v=>v.available)),type:raw.type==='BUNDLE'?'BUNDLE':'PRODUCT',category,details:(raw.additionalInformation??[]).map(d=>({title:stripHtml(d.title),body:stripHtml(d.bodyHtml)})),offers,pricingStrategy:raw.pricingStrategy??null};
}
function checkout(domain:string,id:string):string {
 if(!validCartId(id)) throw new CommerceError('This cart could not be found. Please refresh your bag.',400);
 return `https://${domain}/checkout/?${new URLSearchParams({cartCurrency:'USD',cartId:id})}`;
}
export function normalizeCart(raw:RawCart,products:Product[],domain:string):Cart {
 const grouped=new Map<string,RawCartItem[]>();
 for(const item of raw.items){ const key=item.groupedBy?.groupedId??item.variant.id; grouped.set(key,[...(grouped.get(key)??[]),item]); }
 const lines:CartLine[]=Array.from(grouped,([key,items])=>{
  const first=items[0];const group=first.groupedBy; const bundle=group?products.find(p=>p.id===group.bundleId):null;
  const product=bundle??products.find(p=>p.id===first.variant.product.id);
  let unitPrice=first.variant.unitPrice;
  if(group){
   if(!bundle) throw new CommerceError('This bundle has changed. Please review your bag in the shop.',409,'BUNDLE_CHANGED');
   const ordered=bundle.offers.map(p=>items.find(i=>i.variant.product.id===p.id));
   if(ordered.some(i=>!i)) throw new CommerceError('This bundle is incomplete. Please remove it and select it again.',409,'BUNDLE_CHANGED');
   const cartPriced={...bundle,offers:bundle.offers.map((p,i)=>({...p,variants:p.variants.map(v=>v.id===ordered[i]!.variant.id?{...v,price:ordered[i]!.variant.unitPrice}:v)}))};
   unitPrice=bundlePrice(cartPriced,ordered.map(i=>i!.variant.id));
  }
  return {id:key,name:product?.name??stripHtml(first.variant.product.name),slug:product?.slug??first.variant.product.slug,image:group?(bundle?.images[0]?.url??''):(first.variant.images?.[0]?.url??product?.images[0]?.url??''),description:items.map(i=>`${group?stripHtml(i.variant.product.name)+': ':''}${stripHtml(i.variant.attributes?.description??i.variant.name)}`).join(' · '),quantity:first.quantity,unitPrice,items:items.map(i=>({variantId:i.variant.id,quantity:i.quantity,...(group?{bundleId:group.bundleId}:{})})),bundle:!!group};
 });
 return {id:raw.id,lines,subtotal:{value:Math.round(lines.reduce((s,l)=>s+l.unitPrice.value*l.quantity,0)*100)/100,currency:'USD'},count:lines.reduce((s,l)=>s+l.quantity,0),checkoutUrl:checkout(domain,raw.id)};
}
export class FourthwallProvider implements CommerceProvider {
 private token:string;private domain:string;private fetcher:typeof fetch;
 constructor(config:{token:string;domain:string;fetcher?:typeof fetch}){
  if(!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/i.test(config.domain)||!config.domain.includes('.')) throw new CommerceError('The checkout domain is not configured correctly.',503);
  this.token=config.token;this.domain=config.domain;this.fetcher=config.fetcher??fetch;
 }
 private async request<T>(path:string,method='GET',body?:unknown,fresh=true):Promise<T>{
  if(!this.token) throw new CommerceError('The shop connection is being set up. Please try again soon.',503,'NOT_CONFIGURED');
  const url=new URL('https://storefront-api.fourthwall.com/v1'+path);url.searchParams.set('storefront_token',this.token);url.searchParams.set('currency','USD');
  let response:Response;
  try {response=await this.fetcher(url,{method,headers:{'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{}),signal:AbortSignal.timeout(15000),...(fresh?{cache:'no-store' as const}:{next:{revalidate:60}})});}catch{throw new CommerceError('The shop could not connect. Please try again in a moment.',502,'CONNECTION_ERROR');}
  if(!response.ok){let code='';try{code=(await response.json()).code??'';}catch{}
   const message=code==='CART_QUANTITY_TOO_HIGH'?'That quantity is no longer available. Please reduce the quantity.':code==='CART_NOT_FOUND'?'Your saved bag has expired. Please add your items again.':code==='CART_INCOMPLETE_BUNDLE_ERROR'?'Please select every product in this bundle.':/AVAILABLE|PURCHASABLE|VARIANT/.test(code)?'This selection is no longer available. Please choose another size or color.':'The shop could not update your bag. Please try again.';
   throw new CommerceError(message,response.status===404?404:response.status===400?400:502,code);
  }
  return response.json();
 }
 async listProducts(fresh=false):Promise<Product[]> {
  const results:Product[]=[];let page=0;
  while(page<100){const data=await this.request<{results:RawProduct[];paging:{hasNextPage:boolean}}>(`/collections/all/products?page=${page}&size=50`,'GET',undefined,fresh);results.push(...data.results.map(normalizeProduct));if(!data.paging.hasNextPage) return results;page++;}
  throw new CommerceError('The product catalog could not finish loading. Please try again.');
 }
 async getProduct(slug:string,fresh=false):Promise<Product|null>{
  try{return normalizeProduct(await this.request<RawProduct>(`/products/${encodeURIComponent(slug)}`,'GET',undefined,fresh));}catch(error){if(error instanceof CommerceError&&error.status===404)return null;throw error;}
 }
 private async cart(path:string,method='GET',items?:CartItemInput[]):Promise<Cart>{const raw=await this.request<RawCart>(path,method,items?{items}:undefined);const products=raw.items.some(i=>i.groupedBy)?await this.listProducts(true):[];return normalizeCart(raw,products,this.domain);}
 getCart(id:string){this.checkoutUrl(id);return this.cart(`/carts/${id}`);}
 createCart(items:CartItemInput[]){return this.cart('/carts','POST',items);}
 addItems(id:string,items:CartItemInput[]){this.checkoutUrl(id);return this.cart(`/carts/${id}/add`,'POST',items);}
 updateItems(id:string,items:CartItemInput[]){this.checkoutUrl(id);return this.cart(`/carts/${id}/change`,'POST',items);}
 removeItems(id:string,items:CartItemInput[]){this.checkoutUrl(id);return this.cart(`/carts/${id}/remove`,'POST',items);}
 checkoutUrl(id:string){return checkout(this.domain,id);}
}
