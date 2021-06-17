import * as Libs from './Libs';
import * as Main from './index';

('use strict');

export const inboxToDos = document.getElementById('Inbox');
export const todayToDos = document.getElementById('Today');
export const weekToDos = document.getElementById('Week');
export const containerToDos = document.getElementById('containerToDos');
export const containerFolders = document.getElementById('containerFolders');
export const arrow = document.querySelector('.arrow');
export const dropFolders = document.getElementById('dropFolders');

export const newItem = document.getElementById('newItem');
export const newToDoBtn = document.getElementById('newToDoBtn');
export const newFolderBtn = document.getElementById('newFolderBtn');

export const modalNew = document.getElementById('modalNew');
export const modalNewToDo = document.getElementById('modalNewToDo');
export const modalNewFolder = document.getElementById('modalNewFolder');
export const modalEditToDo = document.getElementById('modalEditToDo');
export const modalEditFolder = document.getElementById('modalEditFolder');

export const confirmNew = document.querySelectorAll('.confirmNew');
export const confirmEdit = document.querySelectorAll('.confirmEdit');
export const cancels = document.querySelectorAll('.cancel');
export const buttonsX = document.querySelectorAll('.button-X');
export const selectList = document.querySelectorAll('.selectList');

export const newToDoTitle = document.getElementById('newToDoTitle');
export const newToDoDescription = document.getElementById('newToDoDescription');
export const newToDoDueDate = document.getElementById('newDueDate');
export const newToDoPriority = document.getElementById('newPriority');
export const newToDoTargetFolder = document.getElementById('newTargetFolder');
export const newFolderTitle = document.getElementById('newFolderTitle');

export const editToDoTitle = document.getElementById('editToDoTitle');
export const editToDoDescription = document.getElementById(
    'editToDoDescription'
);
export const editToDoDueDate = document.getElementById('editDueDate');
export const editToDoPriority = document.getElementById('editPriority');
export const editToDoTargetFolder = document.getElementById('editTargetFolder');
export const editFolderTitle = document.getElementById('editFolderTitle');

const createPara = (text) => {
    const para = document.createElement('p');
    para.textContent = text;
    return para;
};

const createToDoContainer = (item) => {
    const main = document.createElement('div');
    main.id = Libs.libraryToDos.indexOf(item);
    main.classList.add('todo', 'priority' + item.getPriority);
    if (item.getStatus) {
        main.classList.add('completed');
    }
    if (item.checkOutdated) {
        main.classList.add('outdated');
    }

    const contFew = document.createElement('div');
    contFew.classList.add('fewDetails');

    const div1 = document.createElement('div');
    const check = document.createElement('div');
    check.classList.add('checkCompleted');
    check.addEventListener('click', (e) => {
        changeStatus(e.target.closest('.todo'));
    });
    div1.append(check);
    div1.append(
        createPara(item.getDueDate + '\u00A0\u00A0\u00A0' + item.getTitle)
    );

    const div2 = document.createElement('div');
    div2.classList.add('controls');
    div2.append(createDetailsBtn());
    div2.append(createEditBtn());
    div2.append(createDelBtn());

    contFew.append(div1);
    contFew.append(div2);

    const contMore = document.createElement('div');
    contMore.classList.add('moreDetails');
    contMore.append(createPara(item.getDescription));
    contMore.append(createPara('Folder: ' + item.getTargetFolder));

    main.append(contFew);
    main.append(contMore);

    return main;
};

const createFolderContainer = (item) => {
    const main = document.createElement('div');
    main.id = Libs.libraryFolders.indexOf(item);
    main.classList.add('folder');
    main.textContent = item.getTitle;
    main.addEventListener('click', (e) => {
        Main.changeFolder(
            e.currentTarget.firstChild.textContent,
            e.currentTarget
        );
    });
    const sub = document.createElement('span');
    sub.classList.add('controls');
    sub.append(createEditBtn());
    sub.append(createDelBtn());
    sub.append(createCounter());

    main.append(sub);

    return main;
};

const createCounter = () => {
    const counter = document.createElement('span');
    counter.classList.add('counter');
    return counter;
};

const createDetailsBtn = () => {
    const detailsBtn = document.createElement('div');
    detailsBtn.classList.add('detailsBtn');
    detailsBtn.textContent = 'Details';
    detailsBtn.addEventListener('click', (e) => {
        e.target
            .closest('.todo')
            .querySelectorAll('.moreDetails')[0]
            .classList.toggle('drop');
    });
    return detailsBtn;
};

const createDelBtn = () => {
    const deleteBtn = document.createElement('input');
    deleteBtn.setAttribute('type', 'image');
    deleteBtn.classList.add('deleteBtn');
    deleteBtn.src = 'imgs/delete-64.png';
    deleteBtn.alt = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
        deleteItem(e.target.closest('.folder, .todo'));
    });
    return deleteBtn;
};

const createEditBtn = () => {
    const editBtn = document.createElement('input');
    editBtn.setAttribute('type', 'image');
    editBtn.classList.add('editBtn');
    editBtn.src = 'imgs/edit-64.png';
    editBtn.alt = 'Edit';
    editBtn.addEventListener('click', (e) => {
        editItem(e.target.closest('.folder, .todo'));
    });
    return editBtn;
};

const editItem = (el) => {
    if (el.classList.contains('todo')) {
        loadEditToDo(Libs.libraryToDos[el.id]);
        modalEditToDo.style.display = 'flex';
        editToDoTitle.closest('form').id = el.id;
        editToDoTitle.closest('form').classList.add('editToDo');
    } else if (el.classList.contains('folder')) {
        loadEditFolder(Libs.libraryFolders[el.id]);
        modalEditFolder.style.display = 'flex';
        editFolderTitle.closest('form').id = el.id;
        editFolderTitle.closest('form').classList.add('editFolder');
    }
};

const loadEditToDo = (item) => {
    editToDoTitle.value = item.getTitle;
    editToDoDescription.value = item.getDescription;
    editToDoDueDate.value = item.getDueDate;
    editToDoPriority.value = item.getPriority;
    editToDoTargetFolder.value = item.getTargetFolder;
};

const loadEditFolder = (item) => {
    editFolderTitle.value = item.getTitle;
};

const updateSelectList = () => {
    selectList.forEach((select) => {
        select.innerHTML = '';
        const inbox = document.createElement('option');
        inbox.value = 'Inbox';
        inbox.textContent = 'Inbox';
        select.append(inbox);

        Libs.libraryFolders.forEach((folder) => {
            const option = document.createElement('option');
            option.value = folder.getTitle;
            option.textContent = folder.getTitle;
            select.append(option);
        });
    });
};

const counterUpdate = () => {
    const allCounters = document.querySelectorAll('.counter');
    allCounters.forEach((counter) => {
        const id = counter.closest('div').firstChild.textContent;
        const count = Libs.filterToDoList(id).length;
        counter.textContent = count;
    });
};

const deleteItem = (el) => {
    if (el.classList.contains('todo')) {
        Libs.libraryToDos.splice(el.id, 1);
    } else if (el.classList.contains('folder')) {
        Libs.libraryFolders.splice(el.id, 1);
        Main.updateCurrentOpenFolder('Inbox');
        Libs.libraryToDos.forEach((todo) => {
            if (todo.getTargetFolder === el.firstChild.textContent) {
                todo.setTargetFolder = 'Inbox';
            }
        });
    }
    Libs.saveAllLibraries();
    Main.displayFolders();
    Main.displayToDos();
    updateSelectList();
    counterUpdate();
};

const changeStatus = (el) => {
    Libs.libraryToDos[el.id].setStatus = !Libs.libraryToDos[el.id].getStatus;
    Main.displayToDos();
};

export {
    createToDoContainer,
    createFolderContainer,
    updateSelectList,
    counterUpdate,
};
