const electron = require('electron');

const fs = require('fs');
//const { ipcMain } = require('electron');

const ipc = electron.ipcRenderer;




/*-------Default Header------*/

//const ipc = require('electron').ipcRenderer;

const minimaze = document.getElementById("minimize");
const maximaze = document.getElementById("maximaze");
const close = document.getElementById("quit");


minimaze.addEventListener('click', minimazeApp)
maximaze.addEventListener('click', maximazeApp)
close.addEventListener('click', closeApp)

function minimazeApp(){

    ipc.send('minimize');
}

function maximazeApp(){
    ipc.send('maximize');
}

function closeApp(){
    window.close();
}

/* - - - - - - - - - Arrastar Blocos - - - - - - - - - */
const defaultBlock = document.querySelectorAll(".defaultBlock");
const divContainerClones = document.querySelector(".divContainerClones");
const trash = document.querySelector(".trash");
let countClone = 0;
let blocks = [];
let containerBlocks = [];
let paths = [];
let discart = false;
let touching = false;
let touchingItem2 = {
    id: null,
    item: null
};
let containerLenght;
let recursao = true;
let touchingContainer2 = {
    id: null,
    item: null
};
let startReadCode = false
const btnRun = document.querySelector(".btnRun");

//--------------Funções Gerais---------------


//Just Numbers
function justNumbers(text){
    let numbers = text.replace(/[^0-9.]/g,'');
    return parseInt(numbers);
}

//Conferindo colisões

function colisionGeometry(geometry1, geometry2){
    
    //COLISÃO QUADRADO QUADRADO
    let rect1PosX = getOffset(geometry1).left;
    let rect1PosY = getOffset(geometry1).top + 10;
    let rect1Width = getOffset(geometry1).width;
    let rect1Height = getOffset(geometry1).height - 10;

    let rect2PosX = getOffset(geometry2).left;
    let rect2PosY = getOffset(geometry2).top;
    let rect2Width = getOffset(geometry2).width;
    let rect2Height = getOffset(geometry2).height;
    
    if(rect1PosX + rect1Width >= rect2PosX &&
        rect1PosX <= rect2PosX + rect2Width &&
        rect1PosY + rect1Height >= rect2PosY &&
        rect1PosY <= rect2PosY + rect2Height){
        return true;
    }else{
        return false;  
    }
}


function distance(x1, y1, x2, y2){
    let a = x2 - x1
    let b = y1 - y2
    let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))
    return c
}

//getOffset

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height
    };
}


for(let i = 0; i<defaultBlock.length;i++){

    defaultBlock[i].addEventListener("mousedown", ()=>{
        createClone(i)
    });

}

//- - - - - - - - - - Função Principal- - - - - - - - - -

function createClone(i){
    
    countClone++;
    let blockClone = defaultBlock[i].cloneNode(true);
    console.log(defaultBlock[i])
    let clonePath = blockClone.querySelector('.path');
    
    blockClone.querySelector(".path").classList.add("clonePath")

    blockClone.id = `blockClone${countClone}`;
    blockClone.classList.add("blockClone")

    let containerBlock = document.createElement("div");
    containerBlock.id = `containerClone${countClone}`;
    containerBlock.insertAdjacentElement("beforeend", blockClone);
    containerBlock.classList.add("containerBlock");

    divContainerClones.insertAdjacentElement("beforeend", containerBlock);



    let newBlock = {
        id: `block${countClone}`,
        content: blockClone,
        nome: `Teste${countClone}`,
        parent: null,
        touching:false,
        child: null,
        code: null,
        codeEnd: null,
        inputs: null,
    };

    let newContainer = {
        id: `containerBlock${countClone}`,
        content: containerBlock,
        nome: `container${countClone}`,
        parent: null,
        child: null
    }

    let newPath = {
        id: `path${countClone}`,
        content: clonePath,
        name: clonePath.id,
        code: null,
        codeEnd: null,
        inputs: null,
    }

    switch (newPath.name) {
        case "moveSteps":
            newPath.code = `
                this.setX( 'Value' );
            `
            newBlock.code = `
                this.setX( 'value' );
            `
        break;//Block1

        case "turnright":
            newPath.code = `
                this.turn( 'Value' );
            `

            newBlock.code = `
                this.turn( 'Value' );
            `
        break;//Block2

        case "looks_say":
            newPath.code = `
                printf("Ola Mundo!");
                system("PAUSE");
            `

            newBlock.code = `
                printf("Ola Mundo!");
                system("PAUSE");
            `
        break;//Block2

        case "control_waitSeconds":
            newPath.code = `
                this.wait( 'Value' );
            `

            newBlock.code = `
                this.wait( 'Value' );
            `
        break;//Block20
        
        case "control_repeat":
            newPath.code = `
            do {
                // code block to be executed
            `

            newPath.codeEnd = `
            }
            while (condition); `

            newBlock.code = `
            do {
                // code block to be executed
            `
            
            newBlock.codeEnd = `
            }
            while (condition); `
        break;//Block57

        case "whenGreenFlagStart":
            newPath.code = `
            #include <stdio.h>
        
            int main(){`

            newPath.codeEnd = `
                return 1;
            } `

            newBlock.code = `
            #include <stdio.h>
        
            int main(){`
            
            newBlock.codeEnd = `
                return 1;
            } `
        break;

        
        default:
            break;
    }

    


    blocks.push(newBlock);
    containerBlocks.push(newContainer);
    paths.push(newPath)
    //----------------------Movimentação----------------------

    window.addEventListener("mousedown",mousemove1);

    function mousemove1(){
        
        setTimeout(() => {
            window.addEventListener("mousemove", mousemove);
        }, 0);
    }
    function mousemove(event){
        document.body.style.cursor = "grabbing"
        
        blocks[blocks.length - 1].content.style.transform = "translate("+ (event.pageX - 340) + "px ,"+ (event.pageY - 50) +"px)"
    }

    window.addEventListener("mouseup", mouseup)

    function mouseup(){
        document.body.style.cursor = "default"
        window.removeEventListener("mousemove",mousemove);
        window.removeEventListener("mousedown", mousemove1);
        window.removeEventListener("mouseup",mouseup); 
    }

    
    for(let i = 0; i < blocks.length; i++){
        
        blocks[i].content.addEventListener("mousedown", movimentarClone);
        
        function movimentarClone(){
            console.log(i)
            window.addEventListener("mousedown", mousemove1);
            
            function mousemove1(){
                
                setTimeout(()=>{
                    window.addEventListener("mousemove", mousemove);
                }, 0);
            }

            function mousemove(event){
                recursao = true;
                colisionBlock(i);
                followParent()
                //followParent();
                document.body.style.cursor = "grabbing";
                if(blocks[i].parent == null){
                    blocks[i].content.style.transform = "translate("+ (event.pageX - 340) + "px ,"+ (event.pageY - 50) +"px)";
                }else{
                    blocks[i].parent.child = null;
                    blocks[i].parent = null;
                    containerBlocks[i].parent.child = null;
                    containerBlocks[i].parent = null;
                    //Tirar o bloco do lugar que está e pôr na "div container Block"
                    divContainerClones.insertBefore(containerBlocks[i].content, divContainerClones.children[justNumbers(containerBlocks[i].id) - 1])
                }
            }

            window.addEventListener("mouseup", mouseup);
            
            function mouseup(){
                
                document.body.style.cursor = "default";

                if(discart){

                    divContainerClones.removeChild(containerBlocks[i].content)

                    console.log(`${containerBlocks[i].content.id} foi excluído`)

                    containerBlocks.splice(i, 1)
                    blocks.splice(i, 1)
                    paths.splice(i, 1)
                    containerLenght = containerBlocks.length
           
                    let pointContainer = containerBlocks[i];
                    let index;
                    
                    if(pointContainer.child){
                        while(pointContainer.child){
                            pointContainer = pointContainer.child
                            index = containerBlocks.findIndex(x => x.id === pointContainer.id);
                            containerBlocks.splice(index, 1)
                        }
                        containerBlocks.splice(i, 1)
                        console.log(containerBlocks)
                    }


                    /*
                    a = [
                    {prop1:"abc",prop2:"qwe"},
                    {prop1:"bnmb",prop2:"yutu"},
                    {prop1:"zxvz",prop2:"qwrq"}];
                        
                    index = a.findIndex(x => x.prop2 ==="yutu");

                    console.log(index);*/

                    discart = false
                }
                
                if(touching && (blocks[i].child !== touchingItem2.content)){
                    
                    blocks[i].parent = touchingItem2.content;
                    containerBlocks[i].parent = touchingContainer2.content;
                    
                    if(containerBlocks[i].parent.child !== null){
                        if(containerBlocks[i].child !== null){
                            
                            containerBlocks[i].parent.content.insertAdjacentElement("beforeend", containerBlocks[i].content);

                            if(recursao){                         
                                countChild(containerBlocks[i], blocks[i]);
                            }
                            

                            function countChild(container, block){
                                if(container.child !== null){
                                    
                                        countChild(container.child, block.child);
                                    
                                    
                                }else{
                                    block.child = blocks[i].parent.child;
                                    block.child.parent = block
                                    blocks[i].parent.child = blocks[i]

                                    container.child = containerBlocks[i].parent.child;
                                    container.child.parent = container
                                    containerBlocks[i].parent.child = containerBlocks[i]

                                    container.content.insertAdjacentElement("beforeend",container.child.content)
                                    
                                }
                            }
                            recursao = false;
                            
                            followParent()
                        }else{
                            blocks[i].child = blocks[i].parent.child;
                            blocks[i].parent.child.parent = blocks[i];
                            blocks[i].parent.child = blocks[i];

                            containerBlocks[i].child = containerBlocks[i].parent.child;
                            containerBlocks[i].parent.child.parent = containerBlocks[i];
                            containerBlocks[i].parent.child = containerBlocks[i];
                            
                            containerBlocks[i].parent.content.insertAdjacentElement("beforeend", containerBlocks[i].content);
                            containerBlocks[i].content.insertAdjacentElement("beforeend", containerBlocks[i].child.content);
                            touching = false;
                            followParent()
                        } 
                        
                        followParent()
                    }else{
                        
                        containerBlocks[i].parent.child = containerBlocks[i];
                        containerBlocks[i].parent.content.insertAdjacentElement("beforeend", containerBlocks[i].content);
                        blocks[i].parent.child = blocks[i];
                        touching = false;

                        followParent()
                    }
                    blocks[i].parent.touching = false
                    
                followParent()
                }

                followParent()
                
                window.removeEventListener("mousemove", mousemove);
                window.removeEventListener("mousedown", mousemove1);
                window.removeEventListener("mouseup", mouseup);
                
            }

            function colisionBlock(item){

                for(let j = 0; j < containerBlocks.length; j++){
                    if(j !== item){
                        //console.log(item)
                        if(colisionGeometry(paths[item].content, paths[j].content) && (blocks[item].child !== blocks[j])){
                            touchingItem2 = {id:j, content: blocks[j]}
                            touchingContainer2 = {id:j, content: containerBlocks[j]}
                            touching = true;
                            blocks[j].touching = true
                            console.log(j)
                            return;
                            
                        }else{
                            touchingItem2 = null;
                            touching = false;
                            blocks[j].touching = false
                        } 
                    }

                    if(colisionGeometry(paths[item].content, trash)){
                        discart = true
                        blocks[item].content.style.zIndex = "2"
                    }else{
                        discart = false
                        blocks[item].content.style.zIndex = "auto"
                    }
                    
                }
            }
        }


        function followParent(){
            for(j = 0; j < blocks.length; j++){
                if(blocks[j].parent !== null){
                    if(blocks[j].parent.touching){
                        blocks[j].content.style.transform =`translate(${getOffset(main).left + getOffset(blocks[j].parent.content).left - 652}px, ${getOffset(main).top + getOffset(blocks[j].parent.content).top + 60}px)`;
                    }else{
                        blocks[j].content.style.transform =`translate(${getOffset(main).left + getOffset(blocks[j].parent.content).left - 652}px, ${getOffset(main).top + getOffset(blocks[j].parent.content).top - 14}px)`;
                    }
                }
            }
        }

        followParent()

        
    }

    window.addEventListener('mouseup',()=>{ 
        startReadCode = true
    })

    btnRun.addEventListener('click',readCode);

    function readCode(){
        
        
        if(startReadCode){
            let pointBlocks = blocks[0];
            let index;
            
            if(pointBlocks.parent){
                while(pointBlocks.parent){
                    pointBlocks = pointBlocks.parent
                }
                
            }

            readCodeRec(pointBlocks)


            /*if(pointBlocks.child){
                if(pointBlocks.code){
                    console.log(pointBlocks.code)
                }
            }

            if(pointBlocks.child){
                while(pointBlocks.child){
                    pointBlocks = pointBlocks.child
                    if(pointBlocks.code){
                        console.log(pointBlocks.code)
                    }
                }
                console.log(pointBlocks.id)
            }*/
            startReadCode = false
        }
    }

    function readCodeRec(item){
        
        let code = item;
        let codeText = item.code;
        let aux;
        let allCode = code.code;

        if(code.codeEnd !== null){
            aux = code;
            allCode = aux.code;
            if(aux.child){
                while(aux.child){
                    aux = aux.child;
                    allCode = allCode + aux.code;
                }
            }
            allCode = allCode + code.codeEnd;
        }
        console.log(allCode)
        ipc.send('renderer/salvar_arquivo', allCode);
    }
}

let totTextInput = divContainerClones.querySelectorAll('.textInputBlock')

for(i = 0;  i< blocks.length; i++){
    totTextInput[0].addEventListener('click', textInputBlock());

    function textInputBlock(){
        console.log(totTextInput)
        /*let input = document.createElement('input')
        
        totTextInput[0].innerHTML = input.value
    
        let topInput = getOffset(totTextInput[0]).top
        let leftInput = getOffset(totTextInput[0]).left
    
        input.style.position = "absolute"
        input.style.top = `${topInput}px`
        input.style.left = `${leftInput - 200}px`
    
        divContainerClones.insertAdjacentElement("beforeend",input)
        input.focus()
        
        input.addEventListener('change',()=>{
            totTextInput[0].innerHTML = input.value
        })*/
    }
}



/*
d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 156 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 64 c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 h -8  a 4,4 0 0,0 -4,4 v 16 a 4,4 0 0,0 4,4 h  8 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 156 a 4,4 0 0,1 4,4 v 24  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"



d="m 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 156 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 64 c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 h -8  a 4,4 0 0,0 -4,4 v 96 a 4,4 0 0,0 4,4 h  8 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 156 a 4,4 0 0,1 4,4 v 24  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z"


quinta linha: v 96
O 96 é o tamanho

*/