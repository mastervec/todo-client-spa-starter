namespace View{
    declare var bootstrap:any
    type NElement = Element | null
    import ToDoItem = Model.ToDoItem
    export interface View{
        render(args:any):void
    }

    abstract class TabView implements View{
        tabEl: NElement
        contentEl: NElement

        constructor(tabEl: NElement, contentEl:NElement){
            this.tabEl = tabEl
            this.contentEl = contentEl
        }
        abstract render(items:ToDoItem[]):void

        isActive():boolean{
            return this.tabEl?.classList.contains("active")||false
        }
    }
    export class ListView extends TabView{
        private clearContainer(){
            while(this.contentEl?.lastChild){
                this.contentEl.removeChild(this.contentEl.lastChild)
            }
        }

        private compare(a:ToDoItem,b:ToDoItem){
            const dateA = Date.parse(a.deadline||"")
            const dateB = Date.parse(b.deadline||"")
            if(!dateA){
                return 1
            }
            if(!dateB){
                return -1
            }
            return ((dateA)-(dateB))*(-1)
        }

        getCheckedIds():number[]{
            const checked = this.contentEl?.querySelectorAll(".form-check-input:checked")
            const ids:number[]=[]
            checked?.forEach(check=>{
                const id = parseInt(check.getAttribute("data-id")||"")
                if(id) ids.push(id)
            })
            return ids
        }

        render(items: ToDoItem[]): void {
            items.sort(this.compare)
            this.clearContainer()
            for(const item of items){
                const template = document.querySelector("#list-item-template") as HTMLTemplateElement
                const clone = template.content.cloneNode(true) as DocumentFragment
                const listItem = clone.querySelector(".list-group-item")
                const description = clone.querySelector(".list-item-desc")
                const badgeContainer = clone.querySelector(".badge-container")
                const deadline = clone.querySelector(".list-item-deadline")
                const checkBox = clone.querySelector(".form-check-input")
                const badgeTemplate = badgeContainer?.querySelector(".list-item-badge")

                checkBox?.setAttribute("data-id",item.id?.toString()||"")
                if (description){
                    description.textContent=item.description
                }
                if(item.tags){
                    for(const tag of item.tags){
                        const newBadge = badgeTemplate?.cloneNode() as Element

                        newBadge.textContent= tag
                        badgeContainer?.append(newBadge)
                    }
                }
                badgeTemplate?.parentElement?.removeChild(badgeTemplate)
                if(deadline){
                    const date = Date.parse(item.deadline||"")
                    deadline.textContent = (date) ? (new Date(date)).toLocaleString() : ""

                }
                if(listItem){
                    this.contentEl?.append(listItem)
                }
            }
        }

    }

    //class TagsView extends TabView{
    //    render(items: ToDoItem): void {
    //        throw new Error("Method not implemented.")
    //    }
    //}

    export class AddView implements View{
        container: NElement
        modalRef:any
        form:HTMLFormElement

        constructor(container:NElement){
            this.container= container
            this.form=this.container?.querySelector("#item-form") as HTMLFormElement
            this.modalRef = new bootstrap.Modal(this.container)
            this.container?.addEventListener("hidden.bs.modal",()=>this.form.reset())
        }


        render(args:any):void{
           this.modalRef.show()            
        }

        dismiss(){
            this.modalRef.hide()
        }

        enable(){
            this.container?.querySelectorAll(".item-form-field").forEach(field => field.removeAttribute("disabled"))

        }

        disable(){
            this.container?.querySelectorAll(".item-form-field").forEach(field => field.setAttribute("disabled",""))
        }

        parse():ToDoItem{
            const desctiptionEl = this.form.querySelector("#description") as HTMLInputElement
            const tagsEl = this.form.querySelector("#tags") as HTMLInputElement
            const deadlineEl = this.form.querySelector("#deadline") as HTMLInputElement
            const newItem = new ToDoItem(desctiptionEl.value)
            newItem.tags= tagsEl?.value.split(",").map(s=>s.trim()).filter(s=>s.length>0)
            newItem.deadline = deadlineEl.value || ""
            return newItem
        }
    }

    export class ActionButtonView implements View{
        container:NElement
        constructor(container:NElement){
            this.container = container
        }
        render(a:any):void{

        }
        enable(){
            this.container?.classList.remove("disabled")

        }

        disable(){
            console.log(this.container)
            this.container?.classList.add("disabled")
        }
    }

    enum ToastStyle{
        success="bg-success",
        error="bg-danger",
        info="bg-primary"
    }
    export class NotificationView implements View{
        private toastEl:NElement
        private toast:any
        private messageNode:NElement

        constructor(){
            this.toastEl=document.querySelector("#toast")
            this.toast= new bootstrap.Toast(this.toastEl)
            this.messageNode = this.toastEl?.querySelector(".toast-body")||null
        }
        render(message:string):void{
            if(this.messageNode){
                this.messageNode.textContent=message
                this.toast.show()
            }
        }
        private setStyle(style:ToastStyle){
            this.toastEl?.classList.remove(ToastStyle.error)
            this.toastEl?.classList.remove(ToastStyle.success)
            this.toastEl?.classList.remove(ToastStyle.info)
            this.toastEl?.classList.add(style)
        }
        success(message:string){
            this.setStyle(ToastStyle.success)
            this.render(message)

        }
        error(message:string){
            this.setStyle(ToastStyle.error)
            this.render(message)
        }
        info(message:string){
            this.setStyle(ToastStyle.info)
            this.render(message)
            
        }
    }
}