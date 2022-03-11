import { useShopQuery, Seo, CacheDays } from "@shopify/hydrogen";
import gql from "graphql-tag";

export function ProductTestPrice() {
  return <div>{"$0.99"}</div>;
}
