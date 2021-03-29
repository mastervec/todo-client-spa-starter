"use strict";
var View;
(function (View) {
    var ToDoItem = Model.ToDoItem;
    class TabView {
        constructor(tabEl, contentEl) {
            this.tabEl = tabEl;
            this.contentEl = contentEl;
        }
        isActive() {
            var _a;
            return ((_a = this.tabEl) === null || _a === void 0 ? void 0 : _a.classList.contains("active")) || false;
        }
    }
    class ListView extends TabView {
        clearContainer() {
            var _a;
            while ((_a = this.contentEl) === null || _a === void 0 ? void 0 : _a.lastChild) {
                this.contentEl.removeChild(this.contentEl.lastChild);
            }
        }
        compare(a, b) {
            const dateA = Date.parse(a.deadline || "");
            const dateB = Date.parse(b.deadline || "");
            if (!dateA) {
                return 1;
            }
            if (!dateB) {
                return -1;
            }
            return ((dateA) - (dateB)) * (-1);
        }
        getCheckedIds() {
            var _a;
            const checked = (_a = this.contentEl) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".form-check-input:checked");
            const ids = [];
            checked === null || checked === void 0 ? void 0 : checked.forEach(check => {
                const id = parseInt(check.getAttribute("data-id") || "");
                if (id)
                    ids.push(id);
            });
            return ids;
        }
        render(items) {
            var _a, _b, _c;
            items.sort(this.compare);
            this.clearContainer();
            for (const item of items) {
                const template = document.querySelector("#list-item-template");
                const clone = template.content.cloneNode(true);
                const listItem = clone.querySelector(".list-group-item");
                const description = clone.querySelector(".list-item-desc");
                const badgeContainer = clone.querySelector(".badge-container");
                const deadline = clone.querySelector(".list-item-deadline");
                const checkBox = clone.querySelector(".form-check-input");
                const badgeTemplate = badgeContainer === null || badgeContainer === void 0 ? void 0 : badgeContainer.querySelector(".list-item-badge");
                checkBox === null || checkBox === void 0 ? void 0 : checkBox.setAttribute("data-id", ((_a = item.id) === null || _a === void 0 ? void 0 : _a.toString()) || "");
                if (description) {
                    description.textContent = item.description;
                }
                if (item.tags) {
                    for (const tag of item.tags) {
                        const newBadge = badgeTemplate === null || badgeTemplate === void 0 ? void 0 : badgeTemplate.cloneNode();
                        newBadge.textContent = tag;
                        badgeContainer === null || badgeContainer === void 0 ? void 0 : badgeContainer.append(newBadge);
                    }
                }
                (_b = badgeTemplate === null || badgeTemplate === void 0 ? void 0 : badgeTemplate.parentElement) === null || _b === void 0 ? void 0 : _b.removeChild(badgeTemplate);
                if (deadline) {
                    const date = Date.parse(item.deadline || "");
                    deadline.textContent = (date) ? (new Date(date)).toLocaleString() : "";
                }
                if (listItem) {
                    (_c = this.contentEl) === null || _c === void 0 ? void 0 : _c.append(listItem);
                }
            }
        }
    }
    View.ListView = ListView;
    //class TagsView extends TabView{
    //    render(items: ToDoItem): void {
    //        throw new Error("Method not implemented.")
    //    }
    //}
    class AddView {
        constructor(container) {
            var _a, _b;
            this.container = container;
            this.form = (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelector("#item-form");
            this.modalRef = new bootstrap.Modal(this.container);
            (_b = this.container) === null || _b === void 0 ? void 0 : _b.addEventListener("hidden.bs.modal", () => this.form.reset());
        }
        render(args) {
            this.modalRef.show();
        }
        dismiss() {
            this.modalRef.hide();
        }
        enable() {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".item-form-field").forEach(field => field.removeAttribute("disabled"));
        }
        disable() {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".item-form-field").forEach(field => field.setAttribute("disabled", ""));
        }
        parse() {
            const desctiptionEl = this.form.querySelector("#description");
            const tagsEl = this.form.querySelector("#tags");
            const deadlineEl = this.form.querySelector("#deadline");
            const newItem = new ToDoItem(desctiptionEl.value);
            newItem.tags = tagsEl === null || tagsEl === void 0 ? void 0 : tagsEl.value.split(",").map(s => s.trim()).filter(s => s.length > 0);
            newItem.deadline = deadlineEl.value || "";
            return newItem;
        }
    }
    View.AddView = AddView;
    class ActionButtonView {
        constructor(container) {
            this.container = container;
        }
        render(a) {
        }
        enable() {
            var _a;
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.classList.remove("disabled");
        }
        disable() {
            var _a;
            console.log(this.container);
            (_a = this.container) === null || _a === void 0 ? void 0 : _a.classList.add("disabled");
        }
    }
    View.ActionButtonView = ActionButtonView;
    let ToastStyle;
    (function (ToastStyle) {
        ToastStyle["success"] = "bg-success";
        ToastStyle["error"] = "bg-danger";
        ToastStyle["info"] = "bg-primary";
    })(ToastStyle || (ToastStyle = {}));
    class NotificationView {
        constructor() {
            var _a;
            this.toastEl = document.querySelector("#toast");
            this.toast = new bootstrap.Toast(this.toastEl);
            this.messageNode = ((_a = this.toastEl) === null || _a === void 0 ? void 0 : _a.querySelector(".toast-body")) || null;
        }
        render(message) {
            if (this.messageNode) {
                this.messageNode.textContent = message;
                this.toast.show();
            }
        }
        setStyle(style) {
            var _a, _b, _c, _d;
            (_a = this.toastEl) === null || _a === void 0 ? void 0 : _a.classList.remove(ToastStyle.error);
            (_b = this.toastEl) === null || _b === void 0 ? void 0 : _b.classList.remove(ToastStyle.success);
            (_c = this.toastEl) === null || _c === void 0 ? void 0 : _c.classList.remove(ToastStyle.info);
            (_d = this.toastEl) === null || _d === void 0 ? void 0 : _d.classList.add(style);
        }
        success(message) {
            this.setStyle(ToastStyle.success);
            this.render(message);
        }
        error(message) {
            this.setStyle(ToastStyle.error);
            this.render(message);
        }
        info(message) {
            this.setStyle(ToastStyle.info);
            this.render(message);
        }
    }
    View.NotificationView = NotificationView;
})(View || (View = {}));
