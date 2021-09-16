import {useState} from 'react'
import {useQuery} from 'react-query'

import Drawer from '@material-ui/core/Drawer'
import LinearProgress from '@material-ui/core/LinearProgress'
import Grid from '@material-ui/core/Grid'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import Badge from '@material-ui/core/Badge'

import {Wrapper, Button} from './App.styles'
import Item from './Item/Item'
import Cart from './Cart/Cart'

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
}

const getProducts = async (): Promise<CartItemType[]> => await (await fetch('https://fakestoreapi.com/products')).json()

const App = () => {
  const [menuState, setMenuState] = useState(false)
  const [selectedItems, setSelectedItems] = useState([] as CartItemType[])
  const {data, isLoading, error} = useQuery<CartItemType[]>('product', getProducts)
  console.log(data)

  const getTotalItems = (items: CartItemType[]) => items.reduce((num: number, item) => num + item.amount, 0)

  const handleAddToCart = (clickedItem: CartItemType) => {
      setSelectedItems(prev => {
        if (prev.find(item => item.id === clickedItem.id)) {
          return prev.map(item => item.id === clickedItem.id ? {...item, amount: item.amount + 1 } : item)
        }
        return [...prev, {...clickedItem, amount: 1}]
      })
  }

  const handleRemoveFromCart = (id: number) => {
      setSelectedItems(prev => 
        prev.reduce((num, item) => {
          if (item.id === id) {
            if (item.amount === 1) return num
            return [...num, {...item, amount: item.amount - 1}]
          } else {
            return [...num, item]
          }
        }, [] as CartItemType[])
      )
  }

  if (isLoading) return <LinearProgress />
  if (error) return <div>Something went wrong...</div> 

  return (
      <Wrapper>
        <Drawer anchor='right' open={menuState} onClose={() => setMenuState(false)}>
          <Cart cartItems={selectedItems} addToCart={handleAddToCart} removeFromCart={handleRemoveFromCart} />
        </Drawer>
        <Button onClick={() => setMenuState(true)}>
          <Badge badgeContent={getTotalItems(selectedItems)} color='error'>
            <AddShoppingCartIcon />
          </Badge>
        </Button>
        <Grid container spacing={3}>
          {data?.map(item => (
            <Grid item key={item.id} xs={12} sm={4}>
              <Item item={item} handleAddToCart={handleAddToCart} />
            </Grid>
          ))}
        </Grid>
      </Wrapper>
  );
}
export default App;
