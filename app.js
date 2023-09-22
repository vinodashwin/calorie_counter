// storage controller
const storageCtrl = (function() {

    // public method 
    return {
        storeItem: function(item){
            let items;

            if(localStorage.getItem('items') === null){
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getItemFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items; 
        },
        updateItemStorage: function(updateItem){
            items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(item.id === updateItem.id){
                    items.splice(index, 1, updateItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function(id){
            items = JSON.parse(localStorage.getItem('items'));

            items.forEach((item, index) => {
                if(item.id === id){
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();

//item controller
const ItemCtlr = (function() {
    // item constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // data structure
    const data = {
        // item : [
            // {id: 0, name: 'Chole bhature', calories: 1200},
            // {id: 1, name: 'Cookie', calories: 400},
            // {id: 2, name: 'Eggs', calories: 300}
        // ],
        item: storageCtrl.getItemFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // Public method 
    return {
        getItems: function() {
            return data.item
        },
        addItem: function(name, calories){
            let ID;
            if(data.item.length > 0){
                ID = data.item[data.item.length - 1].id + 1;
            } else {
                ID = 0;
            }
            calories = parseInt(calories);
            newItems = new Item(ID, name, calories);
            data.item.push(newItems);
            return newItems;
        },
        getItemById: function(id){
            let found = null;
            data.item.forEach(ele => {
                if(ele.id === id){
                    found = ele;
                }
            });
            return found;
        },
        updateItem: function(name, calories){
            calories = parseInt(calories);
            let found = null;
            data.item.forEach(item => {
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: function(id){
            const ids = data.item.map(item => {
                return item.id;
            });
            const index = ids.indexOf(id);

            data.item.splice(index, 1);
        },
        clearAllItems: function(){
            data.item = []; 
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0
            data.item.forEach(item => {
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        logdata: function() {
            return data
        }
    }
})();

//ui controller
const UICtlr = (function() {

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCalorieInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    // Public method 
    return{
        populateItemList: function(item){
            let html = '';
            item.forEach(item => {
                console.log(item);
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
                </li>`;
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function(){
        return UISelectors;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCalorieInput).value
            }
        },
        addListItem: function(item){
            // show ui list 
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element 
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                            <a href="#" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`;
            console.log('111 ',li);
            // insert element 
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },
        updatelistItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                                                                        <a href="#" class="secondary-content">
                                                                            <i class="edit-item fa fa-pencil"></i>
                                                                        </a>`
                }
            })
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCalorieInput).value = '';
        },
        addItemToForm: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtlr.getCurrentItem().name;
            document.querySelector(UISelectors.itemCalorieInput).value = ItemCtlr.getCurrentItem().calories;
            UICtlr.showEditState();

        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            listItems = Array.from(listItems);
            listItems.forEach(item => {
                item.remove();
            })
        },
        hideItem: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(total){
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        clearEditState: function(){
            UICtlr.clearInput();
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
        },
        showEditState: function(){
            document.querySelector(UISelectors.addBtn).style.display = 'none';
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
        }
    }
})();

// app controller
const AppCtlr = (function(ItemCtlr, storageCtrl, UICtlr) {

    const loadEventListner = function(){
        const UISelector = UICtlr.getSelectors();

        document.querySelector(UISelector.addBtn).addEventListener('click', itemAddSubmit);

        // disable submit on enter 
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })
        document.querySelector(UISelector.itemList).addEventListener('click',itemEditClick);

        document.querySelector(UISelector.updateBtn).addEventListener('click',itemUpdateSubmit);

        document.querySelector(UISelector.deleteBtn).addEventListener('click',itemDeleteSubmit);

        document.querySelector(UISelector.backBtn).addEventListener('click', UICtlr.clearEditState);

        document.querySelector(UISelector.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    const itemAddSubmit = function(e){
        console.log('Add ',e);
        const input = UICtlr.getItemInput();
        console.log(input);
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtlr.addItem(input.name, input.calories);

            UICtlr.addListItem(newItem);

            // total calories 
            const totalCalories = ItemCtlr.getTotalCalories();

            // show total calories 
            UICtlr.showTotalCalories(totalCalories);

            storageCtrl.storeItem(newItem);

            UICtlr.clearInput();
        }
        e.preventDefault();
    }
    // click edit item 
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){
            console.log('edit item',e);
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            const itemToEdit = ItemCtlr.getItemById(id);
            
            ItemCtlr.setCurrentItem(itemToEdit);

            // Add item to form 
            UICtlr.addItemToForm();
        }
        e.preventDefault();
    }
    // update button event 
    const itemUpdateSubmit = function(e){
        const input = UICtlr.getItemInput();

        const updatedItem = ItemCtlr.updateItem(input.name, input.calories);

        UICtlr.updatelistItem(updatedItem);

        // total calories 
        const totalCalories = ItemCtlr.getTotalCalories();

        // show total calories 
        UICtlr.showTotalCalories(totalCalories);

        // update local storage 
        storageCtrl.updateItemStorage(updatedItem);

        UICtlr.clearEditState();
        e.preventDefault();
    }

    // delete button event 
    const itemDeleteSubmit = function(e){
        const currentItem = ItemCtlr.getCurrentItem();

        ItemCtlr.deleteItem(currentItem.id);

        UICtlr.deleteListItem(currentItem.id);

         // total calories 
         const totalCalories = ItemCtlr.getTotalCalories();

         // show total calories 
         UICtlr.showTotalCalories(totalCalories);

         storageCtrl.deleteItemFromStorage(currentItem.id);
         UICtlr.clearEditState();
         e.preventDefault();
    }

    // clear item button event 
    const clearAllItemsClick = function(e){
        ItemCtlr.clearAllItems();

         // total calories 
         const totalCalories = ItemCtlr.getTotalCalories();

         // show total calories 
         UICtlr.showTotalCalories(totalCalories);

        //  remove for ui 
         UICtlr.removeItems();

        //  remove from storage 
         storageCtrl.clearItemFromStorage();

         UICtlr.hideItem();

        e.preventDefault();
    }
    // Public method
    return {
        init: (function() {
            // clear edit state / set initial state 
            UICtlr.clearEditState();
            // Fetch item from item controller 
            const item = ItemCtlr.getItems();

            if(item.length === 0){
                UICtlr.hideItem();
            } else {
                // populate item list to ui controller 
                UICtlr.populateItemList(item);
            }
             // total calories 
             const totalCalories = ItemCtlr.getTotalCalories();

             // show total calories 
             UICtlr.showTotalCalories(totalCalories);

            // load event listener
            loadEventListner();
        })
    }
})(ItemCtlr, storageCtrl, UICtlr);

AppCtlr.init();