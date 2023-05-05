// ------------ START SCRIPT ---------------

window.onload = function startScript() {};

// ------------ MODAL CRUD ---------------

function toggle_visibility(modal_id) {
  let modal = document.getElementById(modal_id).style;

  if (modal.display == 'block') modal.display = 'none';
  else modal.display = 'block';
}

function delete_route(item_id) {
  if (confirm('Are you sure you want to delete this item?')) {
    location.href = `/admin/general_delete_item/${item_id}`;
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
  `/admin/general_edit_menu/${item_id}`;

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
  location.href = `/admin/general_move_item_to_inactive/${item_id}`;
}

function moveToCurrent_route(item_id) {
  location.href = `/admin/general_move_item_to_current/${item_id}`;
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
