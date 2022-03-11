import {usePrice} from './PriceProvider.client';

export default function ProductTestPrice() {
  const {priceGroup} = usePrice();

  console.log({priceGroup});

  if (priceGroup === 'group-1') {
    return <div id={'product-test-price'}>{'$0.99'}</div>;
  } else if (priceGroup === 'group-2') {
    return <div id={'product-test-price'}>{'$99.99'}</div>;
  }
  return <div id={'product-test-price'}>{'$19.99'}</div>;
}
