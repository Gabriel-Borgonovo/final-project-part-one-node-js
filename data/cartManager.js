import fs from 'fs';
import {v4 as uuidv4} from 'uuid';
const path = './data/cart.json';

class CartManager{
    constructor(path) {
        this.path = path;
      }
    
    async createCart() {
        let carts = await this.getCarts();
            
        const cart = {
            id: uuidv4(),
            products: []
            };
            
        carts.push(cart);
        
       // console.log('carrito', carts);
        
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        
    }

    async getCarts(){
        let carts = [];
        if (fs.existsSync(this.path)) {
            carts = JSON.parse(await fs.promises.readFile(this.path));
        }
        
        return carts;
    }

    async getCartById(id){
        let cartsId = await this.getCarts();
        let cart = cartsId.filter(cart => cart.id === id);
        return cart;
    }

    async addProduct(cartId, productId, quantity) {
        let carts = await this.getCarts();
        
        const cart = carts.find((cart) => cart.id === cartId);
        if (cart.lengh === 0) {
            return;
        }

        const existingProduct = cart.products.find((product) => product.id === productId);
      
        if(existingProduct){
            existingProduct.quantity += quantity;
        }else{
            const product = {
                id: productId,
                quantity: quantity,
              };
            cart.products.push(product);
        }

        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
      }

}


export default CartManager;