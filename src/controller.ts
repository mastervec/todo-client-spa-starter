namespace Controller{
    let newestView:View.ListView
    let addView: View.AddView
    let addButton: View.ActionButtonView
    let removeButton: View.ActionButtonView
    let notification:View.NotificationView
    const dynamocViews: View.ListView[] = []
    const dao = new Model.ToDoItemDAO()

    const getActiveView=()=>dynamocViews.find(v=>v.isActive())

    function createComponents(){
        newestView = new View.ListView(document.querySelector("#newest-tab"),
        document.querySelector("#newest-content"))
        addView = new View.AddView(document.querySelector("#form-modal"))
        addButton = new View.ActionButtonView(document.querySelector("#btn-add"))
        removeButton= new View.ActionButtonView(document.querySelector("#btn-remove"))
        notification = new View.NotificationView()
        dynamocViews.push(newestView)
    }
    function refreshActiveView(){
        dao.listAll()
        .then(items => getActiveView()?.render(items))
        .catch(error => notification.error("faio"+error))
    }

    function initToolbar(){
        addButton.container?.addEventListener("click",()=>{
            addView.render(null)
        })
        removeButton.container?.addEventListener("click", async () => {
            console.log(removeButton)
            removeButton.disable()
            await handleRemoval()
            removeButton.enable()
        })
    }

    async function handleRemoval() {
        const checkedIds=getActiveView()?.getCheckedIds()||[]
        const status =[]
        try{
            for(const id of checkedIds){
                
                status.push(await dao.removeById(id))
            }

        } catch(error){
            notification.error("erro de remoção")
            console.log(error)
        }
        if(status.length<1){
            notification.info("Selecione para deletar")
        }
        else if(status.reduce((acc,s)=>acc&&s)){
            notification.success("items removed")
        }else{
            notification.error("alguns falharam")
        }
        refreshActiveView()
    }
    async function handleInsert(){
        console.log("salvando")
        try{
            const status = await dao.addItem(addView.parse())
            refreshActiveView()
            notification.success("Adicionou")
        }catch(error){
            notification.error("deu ruim mermão")
        }
        addView.dismiss()
    }

    function initAddView(){
        addView.form.addEventListener("submit",async (ev)=>{
            ev.preventDefault()
            addView.disable()
            await handleInsert()
            addView.enable()
        })
    }
    window.addEventListener("load",function(){
        createComponents()
        initToolbar()
        initAddView()
        refreshActiveView()
    })
}