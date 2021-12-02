import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from './Product';
import { Grid, Drawer, Badge, LinearProgress } from '@mui/material';
import AddShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { useQuery } from 'react-query';
import { Wrapper, StyledButton } from './App.styles';
import Cart from './Cart';

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const App: React.FC = () => {
  const [products, setProducts] = useState<CartItemType[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);

  const getProducts = async () => {
    const result = await axios.get('https://fakestoreapi.com/products');;
    setProducts(result.data);
    console.log(result.data);
  }

  const { data, isLoading, error } = useQuery(
    'products',
    getProducts
  );

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }
      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };
  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };
  const getTotalItems = (items: CartItemType[]) => {
    return items.reduce((start: number, items) => start + items.amount, 0);

  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;

  return (
    <Wrapper className="App">
      <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart cartItems={cartItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color='error'>
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {products.map((item: CartItemType) => (
          <Grid item key={item.id} xs={12} sm={3}>
            <Product item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

export default App;
