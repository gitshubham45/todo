$('.delete-btn').click(function(){
    const itemId = $(this).attr("id"); // get the ID of the closest li element
    const listTitle = $(this).attr("name");
    console.log(listTitle,itemId);
    deleteItem(itemId,listTitle);
})


function deleteItem (itemId,listTitle){
    // adding bb in last to differentiate from original id b/c it is present in both div and icon
    const toDel = $('#' + itemId + "bb");
    toDel.remove();
    reloadList(itemId, listTitle); // call the deleteItem function with the ID
};




function reloadList(itemId, listTitle) {
    $.ajax({
        url: '/delete',
        method: 'POST',
        data: { _id: itemId, listTitle: listTitle },
        success: function (result) {
            $('.delete-btn').on('click',()=>{
                const itemId = $(this).attr("id"); // get the ID of the closest li element
                const listTitle = $(this).attr("name");
                deleteItem(itemId,listTitle);
            })
        },
        error: function () {
            console.log('Failed to get items');
        },

    });
}


$('.add-btn').click(function(event){
    
    event.preventDefault();
    addItem(event);
    $('#myInput').val('');
});


let requiredId ="";

function addItem(event){
    const formData = $('.main').serialize();
   
    const itemName = formData.replace("newItem=","");
   const listName = $('.add-btn').attr('value');

    const newDiv = $('<div class="item"></div>'); // Create a new <div> element
    const checkbox = $('<input type="checkbox"  >'); // Create a new <h2> element
    const paragraph = $('<p >' + itemName + '</p>'); // Create a new <p> element
    const icon = $('<i  class="fa-solid fa-trash delete-btn"></i>'); // Create a new <p> element

    newDiv.append(checkbox);
    newDiv.append(paragraph);
    newDiv.append(icon);

    $('#bigBox').append(newDiv);

    updateItem(itemName,listName);

    icon.attr("name",listName);
    icon.attr("id",requiredId);
    newDiv.attr('id',requiredId+"bb")
    
   
    console.log(requiredId);

};

function updateItem(item,listName) {
 
    // send the form data to the server using AJAX
    $.ajax({
        url: '/',
        method: 'POST',
        data: {newItem : item , list: listName},
        
        success: function (response) {

            requiredId = response.resultId;

            // $('.add-btn').click((event)=>{
            //     event.preventDefault();
            //     addItem(event);
            // });

        },
        error: function () {
            console.log('Failed to get items');
        },
    });
}

// $(document).ready(function(){
//     $('#myInput').rese();
// });

// $(".add-btn").click(function () {
    
// });

// $('#myInput').on('input', function() {
//    $(this).val("");
//   });




// $('.main').on('submit', function(event) {
//     event.preventDefault();
//     //var value = $('#myInput').val();
//     // do something with the value...
//     $('#myInput').val(''); // clear the input field
// });