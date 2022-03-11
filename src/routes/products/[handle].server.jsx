import {useShopQuery, Seo, CacheDays} from '@shopify/hydrogen';
import {
  ProductProviderFragment,
  ProductSeoFragment,
} from '@shopify/hydrogen/fragments';
import gql from 'graphql-tag';

import ProductDetails from '../../components/ProductDetails.client';
import NotFound from '../../components/NotFound.server';
import Layout from '../../components/Layout.server';
import ProductTestPrice from '../../components/ProductTestPrice.client';
import PriceProviderClient from '../../components/PriceProvider.client';
import ProductProxy, {randomPriceGroup} from '../../lib/ProductProxy';

export default function Product({
  country = {isoCode: 'US'},
  params,
  response,
  request,
}) {
  const {handle} = params;
  response.cache(CacheDays());
  response.headers.set('new-header', 'CustomHeader');

  let priceGroup = request.cookies.get('priceGroup');

  console.log({priceGroup});

  if (!priceGroup) {
    const randomGroup = randomPriceGroup();
    response.headers.set(
      'Set-Cookie',
      `priceGroup=${randomGroup}; SameSite=Lax; Max-Age=3600000; Path=/`,
    );
    priceGroup = randomGroup;
  }

  const {
    data: {product: originalProduct},
  } = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      handle,
    },
    preload: true,
    cache: CacheDays(),
  });

  if (!originalProduct) {
    return <NotFound />;
  }

  const product = new ProductProxy(originalProduct, request, response);

  return (
    <Layout>
      <PriceProviderClient priceGroup={priceGroup}>
        <Seo type="product" data={product} />

        <ProductDetails product={product}>
          <ProductTestPrice />
        </ProductDetails>
      </PriceProviderClient>
    </Layout>
  );
}

const QUERY = gql`
  query product(
    $country: CountryCode
    $handle: String!
    $includeReferenceMetafieldDetails: Boolean = true
    $numProductMetafields: Int = 20
    $numProductVariants: Int = 250
    $numProductMedia: Int = 6
    $numProductVariantMetafields: Int = 10
    $numProductVariantSellingPlanAllocations: Int = 0
    $numProductSellingPlanGroups: Int = 0
    $numProductSellingPlans: Int = 0
  ) @inContext(country: $country) {
    product: product(handle: $handle) {
      id
      vendor
      ...ProductProviderFragment
      ...ProductSeoFragment
    }
  }

  ${ProductProviderFragment}
  ${ProductSeoFragment}
`;
