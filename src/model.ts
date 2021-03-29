namespace Model{
    const RA = "11072516"
    const host ="https://pw2021q1-todo-spa.herokuapp.com/api/"
    export class ToDoItem{
        id?:number
        description:string
        tags?:string[]
        deadline?:string

        constructor(description:string){
            this.id = 0
            this.description=description
            this.tags=[]
            this.deadline=""
        }
    }

    export class ToDoItemDAO{
        async listAll(): Promise<ToDoItem[]>{
            try{
            const response = await fetch(`${host}${RA}/list`)
            if(response.ok){
                return (await response.json()).items as ToDoItem[]

            }
            console.error("Server status " + JSON.stringify(await response.json))
            throw Error("failed list all")
        }
            catch(error){
                console.log("deu ruim")
                throw error
            }
        }
        async addItem(item:ToDoItem):Promise<boolean>{
            try{
                const response = await fetch(`${host}${RA}/add`,{method:"POST",
            headers:{
                "Content-Type":"application/json"
            },body:JSON.stringify(item)})
            if (response.ok){
                return true
            }
            console.error("erro de inserção "+ JSON.stringify(await response.json))
            return false
            
            } catch(error){
                console.error("erro de inserção catch")
                return false
            }
        }

        async removeById(id:number):Promise<boolean>{
            try{
                const response = await fetch(`${host}${RA}/remove/${id}`)
            if (response.ok){
                return true
            }
            console.error("erro de remoção "+ JSON.stringify(await response.json))
            return false
            
            } catch(error){
                console.error("erro de remoção catch")
                return false
            }
        }
    }
}