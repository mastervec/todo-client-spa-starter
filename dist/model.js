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
var Model;
(function (Model) {
    const RA = "11072516";
    const host = "https://pw2021q1-todo-spa.herokuapp.com/api/";
    class ToDoItem {
        constructor(description) {
            this.id = 0;
            this.description = description;
            this.tags = [];
            this.deadline = "";
        }
    }
    Model.ToDoItem = ToDoItem;
    class ToDoItemDAO {
        listAll() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${host}${RA}/list`);
                    if (response.ok) {
                        return (yield response.json()).items;
                    }
                    console.error("Server status " + JSON.stringify(yield response.json));
                    throw Error("failed list all");
                }
                catch (error) {
                    console.log("deu ruim");
                    throw error;
                }
            });
        }
        addItem(item) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${host}${RA}/add`, { method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }, body: JSON.stringify(item) });
                    if (response.ok) {
                        return true;
                    }
                    console.error("erro de inserção " + JSON.stringify(yield response.json));
                    return false;
                }
                catch (error) {
                    console.error("erro de inserção catch");
                    return false;
                }
            });
        }
        removeById(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${host}${RA}/remove/${id}`);
                    if (response.ok) {
                        return true;
                    }
                    console.error("erro de remoção " + JSON.stringify(yield response.json));
                    return false;
                }
                catch (error) {
                    console.error("erro de remoção catch");
                    return false;
                }
            });
        }
    }
    Model.ToDoItemDAO = ToDoItemDAO;
})(Model || (Model = {}));
