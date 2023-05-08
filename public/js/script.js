// ------------ START SCRIPT ---------------
let menu_tab;

window.onload = function startScript() {
  let link = window.location.href;

  // console.log(link);

  if (link.includes('current_menu')) {
    console.log('this link is current menu');
    menu_tab = 'current_menu';
  } else if (link.includes('inactive_menu')) {
    console.log('this link is inactive menu');
    menu_tab = 'inactive_menu';
  }
};

// ------------ MODAL CRUD ---------------

function toggle_visibility(modal_id) {
  let modal = document.getElementById(modal_id).style;

  if (modal.display == 'block') modal.display = 'none';
  else modal.display = 'block';
}

function delete_route(item_id) {
  if (confirm('Are you sure you want to delete this item?')) {
    location.href = `/admin/general_delete_item/${menu_tab}/${item_id}`;
  }
}

//prettier-ignore
function open_editModal(item_id) {
  let item_name = document.getElementById(`menu_name_${item_id}`).innerHTML;
  let item_description = document.getElementById(`menu_description_${item_id}`).innerHTML;
  let item_price = document.getElementById(`menu_price_${item_id}`).innerHTML;
  
  document.getElementById('edit_item_name').value = item_name;
  document.getElementById('edit_item_description').value = item_description.trim();
  document.getElementById('edit_item_price').value = item_price;

  document.getElementById('update_form_container').firstElementChild.action = 
  `/admin/general_edit_menu/${menu_tab}/${item_id}`;

  document.getElementById('edit_modal').style.display = 'block';
}

function close_editModal() {
  document.getElementById('edit_modal').style.display = 'none';
}

function open_editStoreStatusModal() {
  let currentStatus = document
    .getElementById('current_store_status')
    .innerHTML.trim();
  if (currentStatus === 'Store is currently closed') {
    document.getElementById('store_status_option').value = 'closed';
    document.getElementById('store_date_input').value = '';
  } else {
    document.getElementById('store_status_option').value = 'open';
  }
  document.getElementById('edit_store_status_modal').style.display = 'block';
}

function close_editStoreStatusModal() {
  document.getElementById('edit_store_status_modal').style.display = 'none';
}

// ------------ CURRENT AND INACTIVE ---------------

function moveToInactive_route(item_id) {
  location.href = `/admin/general_move_item_to_inactive/current_menu/${item_id}`;
}

function moveToCurrent_route(item_id) {
  location.href = `/admin/general_move_item_to_current/inactive_menu/${item_id}`;
}

function showInactiveMenu_route() {
  location.href = '/admin/general/inactive_menu';
}

function showCurrentMenu_route() {
  location.href = '/admin/general/current_menu';
}

// ------------ UDPATE STORE OPEND DATE ---------------

// function storeStatusSelection() {
//   let selectedStatus = document.getElementById('store_status_option_id');
//   let selectedStatusValue =
//     selectedStatus.options[selectedStatus.selectedIndex].value;

//   let dateInputStyle = document.getElementById('store_date_input').style;
//   // console.log(dateInputStyle);

//   if ((selectedStatusValue = 'no')) {
//     dateInputStyle.color = 'grey';
//     dateInputStyle.textDecoration = 'line-through';
//     dateInputStyle.backgroundColor = '#ffffff92';
//   } else if ((selectedStatusValue = 'yes')) {
//     dateInputStyle.color = 'black';
//     dateInputStyle.textDecoration = 'none';
//     dateInputStyle.backgroundColor = '#fff';
//   }
// }

// ----------- ORDER PAGE START MENU ----------------

// const plus = document.getElementsByClassName('plus-btn');
// const itemsQuantity = document.getElementsByClassName('items-quantity');
// const minus = document.getElementsByClassName('minus-btn');
// const menuItems = document.getElementsByClassName('menu-items');

// for (let i = 0; i < menuItems.length; i++) {
//   let quantity = +itemsQuantity[i].innerHTML;
//   let button_plus = plus[i];
//   let button_minus = minus[i];

//   button_plus.addEventListener('click', function () {
//     quantity++;
//     itemsQuantity[i].innerHTML = quantity;
//     addItemToCart(title, price);
//     updateCartTotal();
//   });

//   button_minus.addEventListener('click', function () {
//     quantity--;
//     itemsQuantity[i].innerHTML = quantity;
//     removeItemFromCart(title, price);
//     updateCartTotal();
//   });
// }

function addItemToCart(item_id) {
  let quantity = +document.getElementById(`item_quantity_${item_id}`).innerHTML;
  let name = document.getElementById(`item_name_${item_id}`).innerHTML;
  let price = +document.getElementById(`item_price_${item_id}`).innerHTML;
  let updateValue = 1;
  let updatePrice = price;
  let initialQuantity = quantity;

  let updateQuantity = quantity + 1;

  document.getElementById(`item_quantity_${item_id}`).innerHTML =
    updateQuantity;

  updateCart(
    updateValue,
    name,
    updatePrice,
    initialQuantity,
    updateQuantity,
    item_id
  );
}

function removeItemFromCart(item_id) {
  let quantity = +document.getElementById(`item_quantity_${item_id}`).innerHTML;
  let name = document.getElementById(`item_name_${item_id}`).innerHTML;
  let price = +document.getElementById(`item_price_${item_id}`).innerHTML;
  let currentItemElement = document.getElementById(`cart_item_${item_id}`);

  let updateValue;
  let updatePrice;
  let updateQuantity;
  let initialQuantity = quantity;

  if (currentItemElement === null) {
    return;
  }

  if (quantity > 0) {
    updateValue = -1;
    updatePrice = -price;
    updateQuantity = quantity - 1;
  } else if (quantity === 0) {
    updateValue = 0;
    updatePrice = 0;
    updateQuantity = 0;
  }

  document.getElementById(`item_quantity_${item_id}`).innerHTML =
    updateQuantity;

  updateCart(
    updateValue,
    name,
    updatePrice,
    initialQuantity,
    updateQuantity,
    item_id
  );
}
//prettier-ignore
function updateCart(updateValue, name, updatePrice, initialQuantity, updateQuantity, item_id) {
  let totalItemsQuantity = +document.getElementById(`subtotal_items_quantity`).innerHTML;
  let totalItemsPrice = +document.getElementById(`subtotal_items_price`).innerHTML;
  let currentItemElement = document.getElementById(`cart_item_${item_id}`);

  let updatedItemsQuantity = totalItemsQuantity + updateValue;
  document.getElementById(`subtotal_items_quantity`).innerHTML = updatedItemsQuantity;

  updatedItemsPrice = totalItemsPrice + updatePrice;
  document.getElementById(`subtotal_items_price`).innerHTML = updatedItemsPrice;

  console.log(updatedItemsQuantity);

  if (updateQuantity === 0) {
    currentItemElement.remove();
    return;
  }
  
  if (initialQuantity === 0) {
    let cartItemDiv = document.createElement('div');
    cartItemDiv.id = `cart_item_${item_id}`
    cartItemContent = `(${updateQuantity}) ${name}`
    cartItemDiv.innerHTML = cartItemContent

    document.getElementById('subtotal_items').appendChild(cartItemDiv);

  } else if (initialQuantity > 0) {
    document.getElementById(`cart_item_${item_id}`).innerHTML = `(${updateQuantity}) ${name}`
  }
  
}
