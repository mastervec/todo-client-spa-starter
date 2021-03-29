"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Controller;
(function (Controller) {
    let newestView;
    let addView;
    let addButton;
    let removeButton;
    let notification;
    const dynamocViews = [];
    const dao = new Model.ToDoItemDAO();
    const getActiveView = () => dynamocViews.find(v => v.isActive());
    function createComponents() {
        newestView = new View.ListView(document.querySelector("#newest-tab"), document.querySelector("#newest-content"));
        addView = new View.AddView(document.querySelector("#form-modal"));
        addButton = new View.ActionButtonView(document.querySelector("#btn-add"));
        removeButton = new View.ActionButtonView(document.querySelector("#btn-remove"));
        notification = new View.NotificationView();
        dynamocViews.push(newestView);
    }
    function refreshActiveView() {
        dao.listAll()
            .then(items => { var _a; return (_a = getActiveView()) === null || _a === void 0 ? void 0 : _a.render(items); })
            .catch(error => notification.error("faio" + error));
    }
    function initToolbar() {
        var _a, _b;
        (_a = addButton.container) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            addView.render(null);
        });
        (_b = removeButton.container) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            console.log(removeButton);
            removeButton.disable();
            yield handleRemoval();
            removeButton.enable();
        }));
    }
    function handleRemoval() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const checkedIds = ((_a = getActiveView()) === null || _a === void 0 ? void 0 : _a.getCheckedIds()) || [];
            const status = [];
            try {
                for (const id of checkedIds) {
                    status.push(yield dao.removeById(id));
                }
            }
            catch (error) {
                notification.error("erro de remoção");
                console.log(error);
            }
            if (status.length < 1) {
                notification.info("Selecione para deletar");
            }
            else if (status.reduce((acc, s) => acc && s)) {
                notification.success("items removed");
            }
            else {
                notification.error("alguns falharam");
            }
            refreshActiveView();
        });
    }
    function handleInsert() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("salvando");
            try {
                const status = yield dao.addItem(addView.parse());
                refreshActiveView();
                notification.success("Adicionou");
            }
            catch (error) {
                notification.error("deu ruim mermão");
            }
            addView.dismiss();
        });
    }
    function initAddView() {
        addView.form.addEventListener("submit", (ev) => __awaiter(this, void 0, void 0, function* () {
            ev.preventDefault();
            addView.disable();
            yield handleInsert();
            addView.enable();
        }));
    }
    window.addEventListener("load", function () {
        createComponents();
        initToolbar();
        initAddView();
        refreshActiveView();
    });
})(Controller || (Controller = {}));
