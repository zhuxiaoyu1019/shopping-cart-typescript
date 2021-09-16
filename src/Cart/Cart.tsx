import CartItem from "../CartItem/CartItem";
import { Wrapper } from "./Cart.styles";
import { CartItemType } from "../App";

type Props = {
    cartItems: CartItemType[];
    addToCart: (item: CartItemType) => void;
    removeFromCart: (id: number) => void;
}

const Cart: React.FC<Props> = ({cartItems, addToCart, removeFromCart}) => {
    const total = (items: CartItemType[]) => items.reduce((num: number, item) => num + item.amount * item.price, 0)

    return (
        <Wrapper>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? 'No item in cart' : cartItems.map(item => <CartItem key={item.id} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />)}
            <h2>Total: ${total(cartItems)}</h2>
        </Wrapper>
    )
}

export default Cart;