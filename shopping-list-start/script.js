


const itemForm = document.getElementById('item-form')
const itemInput = document.getElementById('item-input')
const itemList = document.getElementById('item-list')
const clearBtn = document.getElementById('clear')
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;




function displayItems(){
    const itemsFromStorage = getItemsFromStorage()
    itemsFromStorage.forEach(item=> addItemToDOM(item))
    resetUI()
}


const onAddItemSubmit = (e) =>{
    e.preventDefault()
    const newItem = itemInput.value;
    //validating the input
    if (newItem === ''){
        alert('Please fill out this field')
        return;
    }

    //check for edit mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode')
        removeItemFromStorage(itemToEdit.textContent)
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove()
        isEditMode = false;

    } else{
        if(checkIfItemExists(newItem)){
            alert('The item already exists');
            return;
        }
    }



    //create item dom element

    addItemToDOM(newItem)

    addItemToStorage(newItem)

    
    resetUI()

    itemInput.value = ''
}

function addItemToDOM(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item))

    const button = createButton('remove-item btn-link text-red')
    li.appendChild(button)
      //Add li to the DOM

    itemList.appendChild(li)

}



 const createButton =(classes)=>{
    const button = document.createElement('button')
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon)
    return button;

 }

 const createIcon =(classes)=>{
    const icon = document.createElement('i')
    icon.className = classes;
    return icon;
 }



 function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage()
    
    
    //Adding new item to array
    itemsFromStorage.push(item)
    //convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}

function getItemsFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items')===null){
        itemsFromStorage =[]
    } else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'))
    }

    return itemsFromStorage
}

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);

    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item)
}

function setItemToEdit(item){
    isEditMode = true;
    itemList.querySelectorAll('li').forEach(i=> i.classList.remove('edit-mode'))
    item.classList.add('edit-mode');
    formBtn.innerHTML ='<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = '#228b22'
    itemInput.value = item.textContent;
}

function removeItem(item){
    if(confirm('Are you sure?')){
        //remove item from DOM
        item.remove()
        //remove item from Storage
        removeItemFromStorage(item.textContent)
        resetUI()
    }
}


function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();
    //FILTER out item to be removed\
    itemsFromStorage = itemsFromStorage.filter((i)=> i !==item);
    //Re-set to localstorage

    localStorage.setItem('items', JSON.stringify(itemsFromStorage))
}
function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild)
    }
    //clear from localStorage
    localStorage.removeItem('items');
    resetUI();
}

function filterItems(e){
    const items = itemList.querySelectorAll('li')
    const text = e.target.value.toLowerCase();
    
    items.forEach(item=>{
        const itemName = item.firstChild.textContent.toLowerCase();
        
        if(itemName.indexOf(text) !=-1){
            item.style.display= 'flex'
        } else{
            item.style.display = "none"
        }
    })
}


function resetUI(){

    itemInput.value = '';
    const items = itemList.querySelectorAll('li')
    if(items.length === 0){
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block'
    }
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
   
}

//initialize app
function init(){
     //Event listener
    itemForm.addEventListener('submit', onAddItemSubmit)
    itemList.addEventListener('click', onClickItem)
    clearBtn.addEventListener('click', clearItems )
    itemFilter.addEventListener('input', filterItems)
    document.addEventListener("DOMContentLoaded", displayItems)
    resetUI()
}

init()






