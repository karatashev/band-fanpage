class Product {
  // title = "DEFAULT";
  // imageSrc;
  // price;

  constructor(title, image, price) {
    this.title = title;
    this.imageSrc = image;
    this.price = price;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId, shouldRender = true) {
    this.hookId = renderHookId;
    if (shouldRender) {
      this.render();
    }
  }

  render() {}

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes && attributes.length > 0) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  items = [];

// getters and setters
  set cartItems(value) {
    this.items = value;
    this.totalOutput.innerHTML = `<span class="cart-total-price">\$${this.totalAmount.toFixed(2)}</span>
    `;
  }

  get totalAmount() {
    const sum = this.items.reduce(
      (prevValue, curItem) => prevValue + curItem.price,
       0
      );
    return sum;
  }  

  constructor(renderHookId) {
    super(renderHookId, false);
    //when in arrow function this refers to the object created by the class
    this.orderProducts = () => {
    console.log('Ordering...');
    console.log(this.items);
    };
    this.render();
  }

  addProduct(product) {

    //copy of items array trick with spread operator
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }


  render() {
    const cartEl = this.createRootElement('section', 'content-section');
    cartEl.innerHTML = `
    <h2 class="section-header">CART</h2>
    <div class="cart-row">
      <span class="cart-item cart-header cart-column">ITEM</span>
      <span class="cart-price cart-header cart-column">PRICE</span>
      <span class="cart-quantity cart-header cart-column">QUANTITY</span>
    </div>
    <div class="cart-items"></div>
    <div class="cart-total">
      <strong class="cart-total-title">Total</strong>
      <span class="cart-total-price">\$${0}</span>
    </div>
    <div>
      <button class="btn-purchase" role="button">PURCHASE</button>
    </div>
    `;
    const orderButton = cartEl.querySelector('button');
    orderButton.addEventListener('click', this.orderProducts);
    this.totalOutput = cartEl.querySelector('span.cart-total-price');
  }
}

//the logic to render single Product
class ProductItem  extends Component {
  constructor(product, renderHookId) {
    super(renderHookId, false);
    this.product = product;
    this.render();
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement('div', 'shop-item');
    prodEl.innerHTML = `
      <span class="shop-item-title">${this.product.title}</span>
      <img class="shop-item-image" src="${this.product.imageSrc}" />
    <div class="shop-item-details">
      <span class="shop-item-price">\$${this.product.price}</span>
      <button class="btn shop-item-button" role="button">
        ADD TO CART
      </button>
    </div>
    `;

    const addToCartButton = prodEl.querySelector('button');
    addToCartButton.addEventListener('click', this.addToCart.bind(this));
  }
}

//products are added automatically when creating this class
//as a property
class ProductList extends Component {

  products = [];

  constructor(renderHookId) {
    super(renderHookId);
    this.fetchProducts();
  }

  fetchProducts() {
    this.products = [
      new Product(
        "Album 1",
        "images/rockalbum1.jpg", 
        499.95
        ),
      new Product(
        "Album 2",
        "images/rockalbum2.png", 
        590.95
        ),
      new Product(
        "Album 3",
        "images/rockalbum3.jpg", 
        599.99
        ),
      new Product(
        "Album 4",
        "images/rockalbum4.jpg", 
        799.99
        ),
      new Product(
        "T-shirt",
        "images/rock-tshirt.jpg", 
        599.99
        ),
      new Product(
        "Hoodie",
        "images/rockhoodie.jpg", 
        899.99
        )
    ];
    this.renderProducts();
  }


  renderProducts() {
    for (const prod of this.products) {
      new ProductItem(prod, 'prod-list');
    }
  }

  render() {
    const prodList = this.createRootElement('div', 'shop-items', [new ElementAttribute('id', 'prod-list')]);

    if(this.products && this.products.length > 0) {
      this.renderProducts();
    }
  }
}


class Shop {
  constructor() {
    this.render(); //we r intrested only in render from base class no need to extend.
  }

  render() {
  new ProductList('list-of-items');
  this.cart = new ShoppingCart('list-of-items');

  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    this.cart = shop.cart;
  }
  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();





// if (document.readyState == 'loading') {
//   document.addEventListener('DOMContentLoaded', ready)
// } else {
//   ready();
// }

// function ready() {
//   var removeCartItemsButtons = document.getElementsByClassName("btn-danger");
//   console.log(removeCartItemsButtons);
//   for (var i = 0; i < removeCartItemsButtons.length; i++) {
//     var button = removeCartItemsButtons[i];
//     button.addEventListener("click", removeCartItem)
//     }

//   var quantityInputs = document.getElementsByClassName('cart-quantity-input');
//   for (var i = 0; i < quantityInputs.length; i++) {
//     var input = quantityInputs[i];
//     input.addEventListener('change', quantityChange);
//   }
//   var addToCartButtons = document.getElementsByClassName('shop-item-button');
//   for (var i = 0; i < addToCartButtons.length; i++) {
//     var button = addToCartButtons[i];
//     button.addEventListener ('click', addToCartClicked);
//   }
//   document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked);
// }

// function purchaseClicked() {
//   alert('Thank you for your order');
//   var cartItems = document.getElementsByClassName('cart-items')[0];
//   while (cartItems.hasChildNodes()) {
//     cartItems.removeChild(cartItems.firstChild);
//   }
//   updateCartTotal();
// }

// function removeCartItem(event) {
//   var buttonClicked = event.target;
//       buttonClicked.parentElement.parentElement.remove();
//       updateCartTotal();
// }

// function quantityChange(event) {
//   var input = event.target;
//   if (isNaN(input.value) || input.value <= 0) {
//     input.value = 1;
//   }
//   updateCartTotal();
// }

// function addToCartClicked(event) {
//   var button = event.target;
//   var shopItem = button.parentElement.parentElement;
//   var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
//   var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
//   var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;
//   console.log(title, price, imageSrc);
//   addItemToCart(title, price, imageSrc);
//   updateCartTotal();
// }

// function addItemToCart (title, price, imageSrc) {
//   var cartRow = document.createElement('div');
//   cartRow.classList.add('cart-row');
//   cartRow.innerText = title;
//   var cartItems = document.getElementsByClassName('cart-items')[0];
//   var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
//   for (var i = 0; i < cartItemNames.length; i++) {
//     if(cartItemNames[i].innerText == title) {
//       alert('This item is already added to the cart');
//       return;
//     }
//   }
//   var cartRowContents = `
//     <div class="cart-item cart-column">
//         <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
//         <span class="cart-item-title">${title}</span>
//     </div>
//         <span class="cart-price cart-column">${price}</span>
//     <div class="cart-quantity cart-column">
//         <input class="cart-quantity-input" type="number" value="1">
//         <button class="btn btn-danger" role="button">REMOVE</button>
//     </div>`;
//   cartRow.innerHTML = cartRowContents;
//   cartItems.append(cartRow);
//   cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
//   cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChange);
// }

// function updateCartTotal() {
//   var cartItemContainer = document.getElementsByClassName('cart-items')[0];
//   var cartRows = cartItemContainer.getElementsByClassName('cart-row');
//   var total = 0;
//   for (var i = 0; i < cartRows.length; i++) {
//     var cartRow = cartRows[i];
//     var priceElement = cartRow.getElementsByClassName('cart-price')[0];
//     var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
//     var price = parseFloat(priceElement.innerText.replace('$', ''));
//     var quantity = quantityElement.value;
//     total = total + (price * quantity);
//   }
//   total = Math.round(total * 100) / 100;
//   document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
// }
