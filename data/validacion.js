const productKeys = ['code', 'title', 'description', 'price', 'stock', 'category', 'thumbnail', 'status'];

export function validarProducto(maybeProduct){

    const maybeProductKeys = Object.keys(maybeProduct);

    return (
        productKeys.every((key) => maybeProductKeys.includes(key)) &&
        maybeProductKeys.every((key) => productKeys.includes(key))
    );
}

export function validarProductoParcial(maybeProductParcial){
    const maybeProductKeys = Object.keys(maybeProductParcial);
    
    return (
        maybeProductKeys.length < productKeys.length &&
        maybeProductKeys.every((key) => productKeys.includes(key))
     );
}