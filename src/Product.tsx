import Button from '@mui/material/Button';
import { Wrapper } from './Product.styles';
import { CartItemType } from './App';




interface Props {
    item: CartItemType;
    handleAddToCart: (clickedItem: CartItemType) => void;
};


const Product: React.FC<Props> = ({ item, handleAddToCart }) => {
    return (
        <Wrapper>
            <img src={item.image} alt={item.title} />
            <div>
                <h3>{item.title}</h3>
                <p>item.description</p>
                <h3>{`$${item.price}`}</h3>
            </div>
            <Button onClick={() => handleAddToCart(item)} >Add to Cart</Button>
        </Wrapper>
    );
}

export default Product;