(function() {
    let listArray = [],
    listName = ''
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';
        button.disabled = true;
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        input.addEventListener('input', function() {
            if(input.value !== "") {
                button.disabled = false;
            } else {
                button.disabled = true;
            }
        });

        return {
            form,
            input,
            button,
        };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(obj) {
        let item = document.createElement('li');
        //кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        //устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        item.textContent = obj.name;

        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        if (obj.done == true) item.classList.add('list-group-item-success')

        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success');
            for (const listItem of listArray) {
                if (listItem.id == obj.id) listItem.done = !listItem.done;
            }
            saveList(listArray, listName)
        });
        deleteButton.addEventListener('click', function() {
            if (confirm('Вы уверены?')) {
                item.remove();

                for (let i=0; i<listArray.length; i++) {
                    if (listArray[i].id == obj.id) listArray.splice(i,1)
                }
                saveList(listArray, listName)
            }
        });

        //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
        return {
            item,
            doneButton,
            deleteButton,
        };
    }

    function getNewID(arr) {
        let max = 0;
        for (const item of arr) {
            if (item.id > max) max = item.id;
        }
        return max + 1;
    }

    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr));
    }

    function createTodoApp(container, title = 'Список дел', keyName, defArr = []) {
        let todoAppTytle = createAppTitle(title);
        let TodoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;
        listArray = defArr;

        container.append(todoAppTytle);
        container.append(TodoItemForm.form);
        container.append(todoList);

        let localData = localStorage.getItem(listName)
        if (localData !== null && localData !== '') listArray = JSON.parse(localData)
        
        for (const itemList of listArray){
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.item);
        }

        //браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
        TodoItemForm.form.addEventListener('submit', function(e) {
            //предотвращение стандартного действия браузера - перезагрузки страницы при отправке формы
            e.preventDefault();

            //игнорируем создание элемента, если пользователь ничего не ввел в поле
            if (!TodoItemForm.input.value) {
                return;
            }

            let newItem = {
                id: getNewID(listArray),
                name: TodoItemForm.input.value,
                done: false
            }
            
            let todoItem = createTodoItem(newItem);

            listArray.push(newItem)
            saveList(listArray, listName)
            //создаем и добавляем в список новое дело с названием из поля для ввода
            todoList.append(todoItem.item);

            //обнуляем значение в поле, чтобы не стирать его вручную
            TodoItemForm.button.disabled = true;
            TodoItemForm.input.value = '';
        });
    }

    window.createTodoApp = createTodoApp;
})();