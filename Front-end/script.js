

function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function handleMemeFormError(msg,display){
        var myErrorDiv=document.getElementById("meme-create-form-error")
       
       if (display===true){
           //show error
           myErrorDiv.setAttribute("class","d-block alert alert-danger")
           myErrorDiv.innerText=msg
       }else{
           //hide error
           myErrorDiv.setAttribute("class","d-none alert alert-danger")
       }
   }


function backendHandleData(url,method,myFormData,myForm,id){
    console.log("HEre url is ",url)
        const xhr=new XMLHttpRequest()
        const responseType='json'
        xhr.responseType=responseType
        var csrftoken = getCookie('csrftoken');
        xhr.open(method,url)
        console.log("csrf token is ",csrftoken)
        // xhr.setRequestHeader('Content-Type','application/json')
        if(csrftoken){
        xhr.setRequestHeader("HTTP_X_REQUESTED_WITH","XMLHttpRequest")
        xhr.setRequestHeader("X-Requested-With","XMLHttpRequest")
        xhr.setRequestHeader('X-CSRFToken',csrftoken)  
    }
    
   
    xhr.onload=function(){
            console.log("xhr repsone is ",xhr.response)
            console.log("xhr status is ",xhr.status)
            if (xhr.status===201){
            const newMeme=xhr.response
            console.log("201")
            handleMemeFormError("",false)
            const newMemeElement=formatMemeElement(newMeme)
            const ogHtml=memesContainerElement.innerHTML
            memesContainerElement.innerHTML=newMemeElement+ogHtml
            console.log(newMemeElement)
            myForm.reset()
        }else if(xhr.status===204){
        	console.log("I am in status 204")
        	window.location.href = "index.html";
         	myForm.reset()
        }
        else if (xhr.status===400 || xhr.status===409){
            // console.log("Error here is ",xhr.response)
            const errorJson=xhr.response
            console.log("erroJson is ",errorJson)
            const contentError=errorJson['error']
            console.log("Content error is ",contentError)
    
            let contentErrorMsg;
            if (contentError){
                contentErrorMsg=contentError
                if(contentErrorMsg){
                    handleMemeFormError(contentErrorMsg,true)
                }else{
                    alert("An error occured 404 please try again")
            }   
        }
        else{
            alert("An error occured 404 please try again")
        }
    }else if (xhr.status===500){
            alert("there is server side alert")
        }  
    }
        xhr.onerror=function(){
            alert("An error occurred")
        }
    xhr.send(myFormData)


}



    function handleMemeFormDidSubmit(event){
        event.preventDefault()  
        const myForm=event.target
        var myFormData=new FormData(myForm)
        var url=myForm.getAttribute("action")
        const method=myForm.getAttribute("method")
        url='https://x-meme-s.herokuapp.com'+url
        console.log("Url is ",url)
        backendHandleData(url,method,myFormData,myForm)    
}

function loadMemes(memesElement,meme_id){
	console.log("memesElement and meem_id is ",memesElement,meme_id)
    const xhr=new XMLHttpRequest() 
    const method='GET'
    var url='https://x-meme-s.herokuapp.com/memes/'
    if(meme_id){
    	console.log("I am in url")
    	 url='https://x-meme-s.herokuapp.com/memes/'+meme_id;
    }
    const responseType='json'
    console.log("url is ",url)

    xhr.responseType=responseType
    xhr.open(method,url)
    xhr.onload=function(){
        // console.log(xhr.response)
        const serverResponse=xhr.response
        var listedItems=serverResponse
        // console.log(listedItems)
        if(meme_id===undefined){
        console.log("null id ")
        var finalMemeStr=""
        var i;
        for(i=0;i<listedItems.length;i++){
            var currentItem=formatMemeElement(listedItems[i])
            finalMemeStr+=currentItem
        }
        memesElement.innerHTML=finalMemeStr
    }else if(meme_id){
    	console.log("not null id is ")
        caption.value=listedItems["caption"]
        console.log("Here caption is ",listedItems["caption"])
        link.value=listedItems["url"]
    }
}
    xhr.send()
}





function formatMemeElement(meme){
    var user=meme.name
    var caption=meme.caption
    var image=meme.url
    console.log("user is ",user)
    var formattedMeme="<div class='col-12 col-md-10 mx-auto py-3 mb-4' >" + "<p class='font-weight-bold text-light text-capitalize'> @"+user+"</p>"+"<p>"+
        "<p class='text-truncate text-light text-capitalize'>"+caption+"</p>"+"<img  class='border border-success rounded-lg' src="+image+" alt='My image' width='200' height='200' />"+"</p>"
        +"<div class='btn-group'>"+ "<a  class='btn btn-primary btn-sm' href='Edit.html?"+meme.id+"'>Update</a>" +"</div> </div>"
        
    return formattedMeme
    
    }

