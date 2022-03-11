export const randomInt = (limit: number = 2) => Math.floor( Math.random() * limit )

export const randomPriceGroup = () => {
    return `group-${1 + randomInt( 2 )}`
}

export const getPriceGroup = () => {
    if ( typeof globalThis.priceGroupCookie !== 'undefined' ) {
        return globalThis.priceGroupCookie
    }
    
    if ( typeof document !== 'undefined' ) {
        return document.cookie
                       .split( '; ' )
                       .find( row => row.startsWith( 'priceGroup=' ) )
                       .split( '=' )[1]
    }
    
    return randomPriceGroup()
}

const getPrice = (variantId, { amount, currencyCode }) => {
    const priceGroup = getPriceGroup()
    const prices = {
        'group-1': amount * 0.1,
        'group-2': amount * 10,
        'default': amount,
    }
    
    return prices?.[priceGroup] ?? prices.default
}

const variantHandler = (priceGroup) => ({
    get(variant, propKey, receiver) {
        
        switch ( propKey ) {
            case 'target':
                return variant
            case 'priceV2':
                return {
                    amount: getPrice( variant.id, variant.priceV2 ),
                    currencyCode: variant.priceV2.currencyCode,
                }
            case 'compareAtPriceV2':
                return {
                    amount: getPrice( variant.id, variant.compareAtPriceV2 ),
                    currencyCode: variant.compareAtPriceV2.currencyCode,
                }
            default:
                return Reflect.get( variant, propKey, receiver )
        }
    },
})

const productHandler = (priceGroup) => ({
    get(product, propKey, receiver) {
        
        switch ( propKey ) {
            case 'target':
                return product
            case 'variants':
                return {
                    edges: Reflect.get( product, propKey, receiver ).edges.map( ({ node }) => {
                        return { node: new Proxy( node, variantHandler( priceGroup ) ) }
                    } ),
                }
            default:
                return Reflect.get( product, propKey, receiver )
        }
    },
})

export default class ProductProxy {
    
    constructor(product, priceGroup) {
        return new Proxy( product, productHandler( priceGroup ) )
    }
}
