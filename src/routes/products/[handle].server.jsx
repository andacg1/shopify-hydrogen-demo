import { useShopQuery, Seo } from "@shopify/hydrogen";
import {
  ProductProviderFragment,
  ProductSeoFragment,
} from "@shopify/hydrogen/fragments";
import gql from "graphql-tag";

import ProductDetails from "../../components/ProductDetails.client";
import NotFound from "../../components/NotFound.server";
import Layout from "../../components/Layout.server";
import { ProductTestPrice } from "../../components/ProductTestPrice.server";

export default function Product({
  country = { isoCode: "US" },
  params,
  response,
}) {
  const { handle } = params;
  response.headers.set("new-header", "CustomHeader");
  response.headers.set("Very-New-Header", "CustomHeader");
  response.headers.set(
    "Set-Cookie",
    'customCookie="server-side-cookie"; SameSite=None'
  );

  const {
    data: { product },
  } = useShopQuery({
    query: QUERY,
    variables: {
      country: country.isoCode,
      handle,
    },
    preload: true,
  });

  if (!product) {
    return <NotFound />;
  }

  return (
    <Layout>
      <Seo type="product" data={product} />

      <ProductDetails product={product}>
        <ProductTestPrice />
      </ProductDetails>
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
