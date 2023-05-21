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

  if (performance.navigation.type == 2) {
    location.reload(true);
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

function delete_order_current(order_id) {
  if (confirm('Are you sure you want to delete this order?')) {
    location.href = `/admin/orders/current/delete_order/${order_id}`;
  }
}

function delete_order_completed(order_id) {
  if (confirm('Are you sure you want to delete this order?')) {
    location.href = `/admin/orders/completed/delete_order/${order_id}`;
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

// ------------ ADD NEW DATE OPTION ---------------

function addDateOption() {
  let dateOption = document.createElement('option');
  let dateValue = document.createElement('input');
  let addDate = document.getElementById('input_date_options').value;
  let insertDate = `<option value="">${addDate}</option>`;

  dateValue.type = 'hidden';
  dateValue.value = addDate;
  dateValue.name = 'open_date_option';

  dateOption.innerHTML = insertDate;

  document.getElementById('date_options').appendChild(dateOption);
  document.getElementById('date_options_input_values').appendChild(dateValue);

  document.getElementById('input_date_options').value = '';
}

function resetDateOptions() {
  document.getElementById('date_options').innerHTML = '';
  document.getElementById('date_options_input_values').innerHTML = '';
  let dateOption = document.createElement('option');
  let insertDate = `<option value="">click to see dates</option>`;
  dateOption.innerHTML = insertDate;
  document.getElementById('date_options').appendChild(dateOption);
}

// ----------- ORDER PAGE START MENU ----------------

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
  let firstCartItem = document.querySelectorAll(
    '.subtotal-each-items > div:first-child'
  )[0]

  let updatedItemsQuantity = totalItemsQuantity + updateValue;
  document.getElementById(`subtotal_items_quantity`).innerHTML = updatedItemsQuantity;

  updatedItemsPrice = totalItemsPrice + updatePrice;
  document.getElementById(`subtotal_items_price`).innerHTML = updatedItemsPrice;

  if (updatedItemsPrice === 0) {
    document.getElementById('subtotal_items_price').innerHTML = '';
  } 

  if (updateQuantity === 0) {
    currentItemElement.remove();
    removeItemComma();
    return;
  }
  
  if (initialQuantity === 0) {
    let cartItemDiv = document.createElement('div');
    cartItemDiv.id = `cart_item_${item_id}`;
    cartItemContent = `, (${updateQuantity}) ${name}<input type="hidden" name="menu_id" value="${item_id}"><input type="hidden" name="quantity" value="${updateQuantity}">`;
    cartItemDiv.innerHTML = cartItemContent;
  
    document.getElementById('subtotal_items').appendChild(cartItemDiv);
    removeItemComma();

  } else if (initialQuantity > 0) {
    document.getElementById(`cart_item_${item_id}`).innerHTML = `, (${updateQuantity}) ${name}<input type="hidden" name="menu_id" value="${item_id}"><input type="hidden" name="quantity" value="${updateQuantity}">`
    removeItemComma();
  }
  
}

function removeItemComma() {
  let cartItemCheck = document.querySelectorAll(
    '.subtotal-each-items > div:first-child'
  )[0];

  if (cartItemCheck == null) {
    return;
  }

  let firstCartItem = document.querySelectorAll(
    '.subtotal-each-items > div:first-child'
  )[0].innerHTML;

  let firstCartItemCharacter = firstCartItem.slice(0, 1);
  let removedComma = firstCartItem.slice(2);

  if (firstCartItemCharacter !== ',' || firstCartItemCharacter === undefined) {
    return;
  } else {
    document.querySelectorAll(
      '.subtotal-each-items > div:first-child'
    )[0].innerHTML = removedComma;
  }
}

function returnMenu_route() {
  if (confirm('Are you sure you want to restart your order?')) {
    location.href = '/order';
  }
}

function returnDeliveryInfo_route(cart_id) {
  location.href = `/cart/${cart_id}`;
}

// -------------- ADMIN ORDERS -----------------

function open_deliveryCostModal(order_id) {
  document.getElementById('delivery_cost_modal').style.display = 'block';
  document.getElementById(
    'delivery_cost_form'
  ).action = `/admin/update_delivery_cost/${order_id}`;
  console.log(order_id);
}

function close_deliveryCostModal() {
  document.getElementById('delivery_cost_modal').style.display = 'none';
}
