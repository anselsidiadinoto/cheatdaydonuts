// ------------ MODAL CRUD ---------------

function toggle_visibility(modal_id) {
  let modal = document.getElementById(modal_id).style;

  if (modal.display == 'block') modal.display = 'none';
  else modal.display = 'block';
}

function delete_route(item_id) {
  if (confirm('Are you sure you want to delete this item?')) {
    location.href = '/admin/general_delete_item/' + item_id;
  } else {
  }
}

//prettier-ignore
function open_editModal(item_id) {
  let item_name = document.getElementById(`menu_name_${item_id}`).innerHTML;
  let item_description = document.getElementById(`menu_description_${item_id}`).innerHTML;
  let item_price = document.getElementById(`menu_price_${item_id}`).innerHTML;

  document.getElementById('edit_item_name').value = item_name;
  document.getElementById('edit_item_description').value = item_description;
  document.getElementById('edit_item_price').value = item_price;

  document.getElementById('update_form_container').firstElementChild.action = `/admin/general_edit_menu/${item_id}`;

  let editModal = document.getElementById('edit_modal').style;

  if (editModal.display == 'block') editModal.display = 'none';
  else editModal.display = 'block';
}

function close_editModal() {
  let editModal = document.getElementById('edit_modal').style;

  if (editModal.display == 'block') editModal.display = 'none';
  else editModal.display = 'block';
}

// ------------ CURRENT AND INACTIVE ---------------

function moveToInactive_route(item_id) {
  location.href = `/admin/general_move_item_to_inactive/${item_id}`;
}

function moveToCurrent_route(item_id) {
  location.href = `/admin/general_move_item_to_current/${item_id}`;
}

function showInactiveMenu_route() {
  location.href = `/admin/general_show_inactive`;
}

function showCurrentMenu_route() {
  location.href = `/admin/general`;
}
