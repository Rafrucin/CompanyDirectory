$(window).on('load', function () 
	{if ($('#preloader').length) 
	{$('#preloader').delay(1000).fadeOut('slow',function () 
	{$(this).remove();});}});


const navLinks = document.querySelectorAll('.nav-link')
const menuToggle = document.getElementById('navbarToggleExternalContent')
const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle:false})
navLinks.forEach((l) => {
    l.addEventListener('click', () => { bsCollapse.toggle() })
})

showAllEmployees()
var allEmployees =[];
var allLocations =[]; 
var allDepartments =[];
var searchedEmps = [];
var tempLocation = {};
var tempDep = {};
var tempObject = {};
var yellowAlertOK = false;
var currentEmployeeId;
var currentLocationId;
var currentDepartmentId;
var currentEmployee;
var currentDepartment;
var currentLocation;
getLocations();
getAllEmployees();
getDepartments();
setinputAddEmpDep();

//flags
var allEmployeesFlag = false
var allDepartmentsFlag = false
var allLocationsFlag = false
var yellowFlag = false;


function hideAllScreens(){
    $('#addScreen').hide();
    $('#editScreen').hide();
    $('#searchScreen').hide();
    $('#manageLocation').hide();
    $('#showEmployees').hide();
}

function showModal(){
    $("#myModal").modal();
}

function hideModal(){
    $("#myModal").modal("hide");
}

function showyellowAlert(arg, arg2){ 
    if(typeof arg2 === 'undefined'){
        arg2 = 'Save changes?'
    }
    yellowFlag = false;
    $("#yellowAlert").removeClass('d-none')
    $("#yellowAlert-conten-text").html(arg)
    $("#yellow-sm").html(arg2)
    $("#yellowAlert").fadeIn();
}

function hideyellowAlert(arg){
        yellowAlertOK = arg;
        yellowFlag = true
        $("#yellowAlert").fadeOut();
}

function showRedAlert(arg){ 
    $("#redAlert").removeClass('d-none')
    $("#redAlert").html(arg)
    $("#redAlert").fadeIn().delay(1000).fadeOut();
 }

 function showGreenAlert(arg){ 
    $("#greenAlert").removeClass('d-none')
    $("#greenAlert").html(arg)
    $("#greenAlert").fadeIn().delay(1000).fadeOut();
 }

function removeActive() {
    var navLinks = document.querySelectorAll(".active");
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].classList.remove('active');
    }
}

function clearAllInputs(){
    var elements = document.getElementsByTagName("input");
    for (var ii=0; ii < elements.length; ii++) {
        if (elements[ii].type == "text" || elements[ii].type == "email") {
            elements[ii].value = "";
        }
    }
}

function showAddEmployee(){  
    hideAllScreens();
    removeActive();
    $('#addScreen').fadeIn();
    $('#navAdd').addClass('active');
    $('#sideAdd').addClass('active');
    setinputAddEmpDep();
}

function showSearch(){
    hideAllScreens();
    removeActive();
    $('#searchScreen').fadeIn();
    $('#sideSearch').addClass('active');
    $('#navSearch').addClass('active');
    setsearchinputDepartment();
    setsearchinputLocation();
}

function showAllEmployees(){
    hideAllScreens();
    removeActive();
    setShowEmployeesresult();
    $('#showEmployees').fadeIn();
    $('#sideShowAll').addClass('active');
    $('#navShowAll').addClass('active');
    
}

function showManage(){
    hideAllScreens();
    removeActive();
    $('#manageLocation').fadeIn();
    $("#departmentAddSearch").hide();
    $("#locationAddSearch").fadeIn();
    $('#sideManage').addClass('active');
    $('#navManage').addClass('active');
    setsearchResultDepartment();
    setsearchResultLocation();
    setdepartmentinputLocation();
    $('#locationAdd').removeClass('d-none');
    $('#locationEdit').addClass('d-none');
    $('#locationEditCancel').addClass('d-none');    
    $('#locationinput').val('');
    $('#departmentAdd').removeClass('d-none');
    $('#departmentEdit').addClass('d-none');
    $('#departmentEditCancel').addClass('d-none');    
    $('#departmentinput').val('');
}

function showEdit(empId){
    seteditinputDepartment();
    setEditEmployeeFields(empId);
    hideAllScreens();
    removeActive();
    $('#editScreen').fadeIn();
    $('#sideSearch').addClass('active');
    $('#navSearch').addClass('active');

}

//CLICKS
$(document).ready(function(){
    $("#sideSearch").click(function(){showSearch();clearAllInputs()});
    $("#navSearch").click(function(){showSearch(); clearAllInputs()});
    $("#navAdd").click(function(){showAddEmployee();clearAllInputs() });
    $("#sideAdd").click(function(){showAddEmployee(); clearAllInputs()});
    $("#sideShowAll").click(function(){showAllEmployees();clearAllInputs() });
    $("#navShowAll").click(function(){showAllEmployees();clearAllInputs() });
    $("#navManage").click(function(){showManage(); clearAllInputs()});
    $("#sideManage").click(function(){showManage();clearAllInputs() });
    $("#showLocationsButton").click(function(){setsearchResultLocation(); clearAllInputs()});
    $("#showDepartmentsButton").click(function(){setsearchResultDepartment(); clearAllInputs()});
    $("#searchSubmit").click(function(){searchEngine(); });
    $("#modalBtnOK").click(function(){hideModal(); });
    $("#modalBtnCancel").click(function(){hideModal(); });
    $("#locationAdd").click(function(){addLocation(); });
    $("#departmentAdd").click(function(){addDepartment(); });
    $("#addScreenAdd").click(function(){addEmployee(); });
    $("#editRemove").click(function(){removeEmployee(); });
    $("#yellowOK").click(function(){hideyellowAlert(1); });
    $("#yellowCancel").click(function(){hideyellowAlert(0); });
    $("#locationEditCancel").click(function(){showManage(); });
    $("#locationEdit").click(function(){modifyLocation(); });
    $("#departmentEditCancel").click(function(){ cancelUpdateDepartment()})
    $("#departmentEdit").click(function(){modifyDepartment(); });
    $("#editUpdate").click(function(){modifyEmployee(); });
    $("#addDept2").click(function(){addDept2(); });
    $("#addloc2").click(function(){addloc2(); });

    
  });

  function addloc2(){
    $('#addLocForm').removeClass('d-none');
    $('#addloc2').addClass('d-none');
  }

  function addDept2()
  {
    $('#addDeptForm').removeClass('d-none');
    $('#addDept2').addClass('d-none');
  }

  //GetLocations()
  function getLocations() {
       $.ajax({
           url: "libs/php/getAllLocations.php",
           type: 'GET',
           dataType: 'json',
           success: function(result) {
                allLocations = result.data                
               	allLocationsFlag = true;
           },
           error: function(jqXHR, textStatus, errorThrown) {
               console.log(jqXHR, textStatus, errorThrown)
               showRedAlert('Transaction failed')
           }
       }); 
  };

  function getDepartments() {
    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: 'GET',
        dataType: 'json',
        success: function(result) {           
                allDepartments = result.data                  
                allDepartmentsFlag = true;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
        }
    }); 
  };

  
  function getAllEmployees() {
	$.ajax({
		url: "libs/php/getAll.php",
		type: 'GET',
		dataType: 'json',
		data: {		},
		success: function(result) {										    
                    allEmployees = result.data;		
                    allEmployeesFlag = true;                 						
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
};

async function setShowEmployeesresult(){
    $('#showEmployeesresult').html('');
    if(!allEmployeesFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(!allEmployees.length){
        $('#showEmployeesresult').html('No data');
    }
    else{
        var str ='<div class="d-none d-lg-block"><table id ="allEmpTable" class="table table-striped table-dark table-sm table-hover ">'
        str = str + '<thead><tr><th scope="col">Last and First Name</th><th scope="col">Email</th>'
        str = str + '<th scope="col">Job Title</th><th scope="col">Department</th><th scope="col">Location</th></tr></thead><tbody>'
        for(var i = 0; i < allEmployees.length; i++) {
            var row = allEmployees[i];					
            str = str+'<tr onclick="empClick('+row.id+')"><td align="center">'+row.lastName+' '+row.firstName+'</td>'
            str = str+'<td align="center">'+row.email+'</td><td>'+row.jobTitle+'</td>'
            str = str+'<td align="center">'+row.department+'</td><td>'+row.location+'</td></tr>'
        }
        str = str+'</table></div>'   
        str = str + '<div class="d-lg-none"><table id ="allEmpTable" class="table table-striped table-dark table-sm table-hover">'
        str = str + '<thead><tr><th scope="col">Last and First Name</th>'
        str = str + '<th scope="col">Department</th></tr></thead><tbody>'
        for(var i = 0; i < allEmployees.length; i++) {
            var row = allEmployees[i];					
            str = str+'<tr onclick="empClick('+row.id+')"><td align="center">'+row.lastName+' '+row.firstName+'</td>'
            str = str+'<td align="center">'+row.department+'</td></tr>'
        }
        str = str+'</table></div>'                  			
        $('#showEmployeesresult').html(str);
    }   
}

function empClick(arg){
    getEmployeeById(arg)
}

async function setsearchResultLocation(){ 
    $('#addloc2').removeClass('d-none');
    $('#addLocForm').addClass('d-none');
    $("#departmentAddSearch").hide();
    $("#locationAddSearch").fadeIn(); 
    $('#searchResultLocation').fadeOut() 
    $('#searchResultLocation').html('');
    while ( !allLocationsFlag) {
        await new Promise(r => setTimeout(r, 500));
    }
    if(!allLocations.length){
        $('#searchResultLocation').html('No data');
    }
    else{
        var str ='<table id ="LocationsTable" class="table table-striped table-dark table-sm table-hover">'
        str = str + '<thead><tr><th scope="col">Location Name</th><th scope="col">Action</th></thead><tbody>'
        for(var i = 0; i < allLocations.length; i++) {
            var row = allLocations[i];					
            str = str+'<tr><td>'+row.name+'</td>'
            str = str+'<td><button onclick="modifyLocationClick('+row.id+')" class="btn btn-warning btn-sm m-1"><i class="fas fa-edit"></i></button>'
            str = str+'<button onclick="removeLocation('+row.id+')" class="btn btn-danger btn-sm m-1"><i class="far fa-trash-alt"></i></button></td></tr>'
        }
        str = str+'</table>'                    			
        $('#searchResultLocation').html(str);
        $('#searchResultLocation').fadeIn();
    }   
}


async function setsearchResultDepartment(){ 
    $('#departmentinput').val(''); 
    $("#locationAddSearch").hide();
    $("#departmentAddSearch").fadeIn();  
    $('#searchResultLocation').html('');
    $('#addDept2').removeClass('d-none');
    $('#addDeptForm').addClass('d-none'); 
    while ( !allDepartmentsFlag) {
        await new Promise(r => setTimeout(r, 500));
    }
    if(!allDepartments.length){
        $('#searchResultDepartment').html('No data');
    }
    else{
        var str ='<table id ="DepartmentTable" class="table table-striped table-dark table-sm table-hover">'
        str = str + '<thead><tr><th scope="col">Department Name</th><th scope="col">Action</th></thead><tbody>'
        for(var i = 0; i < allDepartments.length; i++) {
            var row = allDepartments[i];					
            str = str+'<tr><td>'+row.name+'</td>'
            str = str+'<td><button onclick="modifyDepartmentClick('+row.id+')" class="btn btn-warning btn-sm m-1"><i class="fas fa-edit"></i></button>'
            str = str+'<button onclick="removeDepartment('+row.id+')" class="btn btn-danger btn-sm m-1"><i class="far fa-trash-alt"></i></button></td></tr>'
        }
        str = str+'</table>'                    			
        $('#searchResultDepartment').html(str);
    }   
}

async function setinputAddEmpDep(){
    while(!allDepartmentsFlag){
        await new Promise(r => setTimeout(r, 1000));}
    var select = document.getElementById("inputAddEmpDep"); 
        select.innerHTML = "<option selected value=-1>Department...</option>";
        for(var i = 0; i < allDepartments.length; i++) {
            var opt = allDepartments[i];
            select.innerHTML += "<option value=\"" + opt.id + "\">" + opt.name + "</option>";
        }		
}

async function setsearchinputDepartment(){
    while(!allDepartmentsFlag){
        await new Promise(r => setTimeout(r, 1000));}
    var select = document.getElementById("searchinputDepartment"); 
        select.innerHTML = "<option selected value=-1>Department...</option>";
        for(var i = 0; i < allDepartments.length; i++) {
            var opt = allDepartments[i];
            select.innerHTML += "<option value=\"" + opt.id + "\">" + opt.name + "</option>";
        }		
}

async function setsearchinputLocation(){
    while(!allLocationsFlag){
        await new Promise(r => setTimeout(r, 1000));}
    var select = document.getElementById("searchinputLocation"); 
        select.innerHTML = "<option selected value=-1>Location...</option>";
        for(var i = 0; i < allLocations.length; i++) {
            var opt = allLocations[i];
            select.innerHTML += "<option value=\"" + opt.id + "\">" + opt.name + "</option>";
        }		
} 

async function setdepartmentinputLocation(){
    while(!allLocationsFlag){
        await new Promise(r => setTimeout(r, 1000));}
    var select = document.getElementById("departmentinputLocation"); 
        select.innerHTML = "<option selected value=-1>Choose Location...</option>";
        for(var i = 0; i < allLocations.length; i++) {
            var opt = allLocations[i];
            select.innerHTML += "<option value=\"" + opt.id + "\">" + opt.name + "</option>";
        }		
}

async function seteditinputDepartment(){
    while(!allDepartmentsFlag){
        await new Promise(r => setTimeout(r, 500));}
    var select = document.getElementById("editinputDepartment"); 
        select.innerHTML = "<option value=-1>Department...</option>";
        for(var i = 0; i < allDepartments.length; i++) {
            var opt = allDepartments[i];
            select.innerHTML += "<option value=\"" + opt.id + "\">" + opt.name + "</option>";
        }		
}

function setEditEmployeeFields(empId){   
    var department = allDepartments.filter(dep=>{
        return dep.name == currentEmployee.department;
    })
    document.querySelector('#editinputDepartment [value="' + department[0].id + '"]').selected = true;
    $('#editfirstName').val(currentEmployee.firstName);
    $('#editlastName').val(currentEmployee.lastName);
    $('#editjobTitle').val(currentEmployee.jobTitle);
    $('#editemail').val(currentEmployee.email);
}

function searchEngine(){
    searchedEmps = allEmployees;
    if($('#searchfirstName').val()){
        searchedEmps = searchedEmps.filter(emp => {
            return emp.firstName == $('#searchfirstName').val();
          })     
    }
    if($('#searchlastName').val()){
        searchedEmps = searchedEmps.filter(emp => {
            return emp.lastName == $('#searchlastName').val();
          })     
    }
        searchedEmps = searchedEmps.filter(emp => {
            return emp.jobTitle == $('#searchjobTitle').val();
          })   

    if($('#searchinputLocation').val()>0){
        var location = allLocations.filter(loc=>{
            return loc.id == $('#searchinputLocation').val()
        })
        searchedEmps = searchedEmps.filter(emp => {
            return emp.location == location[0].name;
          })    
    }
    if($('#searchinputDepartment').val()>0){
        var dep = allDepartments.filter(dep=>{
            return dep.id == $('#searchinputDepartment').val()
        })
        searchedEmps = searchedEmps.filter(emp => {
            return emp.department == dep[0].name;
          })    
    }
    setsearchResult()
}  

function setsearchResult(){
    $('#searchResult').html('');
    if(!searchedEmps.length){
        $('#searchResult').html('No matching data');
    }
    else{
        var str ='<table id ="allEmpTable" class="table table-striped table-dark table-sm table-hover d-none d-lg-block">'
        str = str + '<thead><tr><th scope="col">Last Name</th><th scope="col">First Name</th><th scope="col">Email</th>'
        str = str + '<th scope="col">Job Title</th><th scope="col">Department</th><th scope="col">Location</th></tr></thead><tbody>'
        for(var i = 0; i < searchedEmps.length; i++) {
            var row = searchedEmps[i];					
            str = str+'<tr onclick="empClick('+row.id+')"><td align="center">'+row.lastName+'</td><td>'+row.firstName+'</td>'
            str = str+'<td align="center">'+row.email+'</td><td>'+row.jobTitle+'</td>'
            str = str+'<td align="center">'+row.department+'</td><td>'+row.location+'</td></tr>'
        }
        str = str+'</table>'  
        str = str+ '<table id ="allEmpTable" class="table table-striped table-dark table-sm table-hover d-lg-none">'     
        str = str + '<thead><tr><th scope="col">Last Name and First Name</th>'
        str = str + '<th scope="col">Department</th></tr></thead><tbody>'
        for(var i = 0; i < searchedEmps.length; i++) {
            var row = searchedEmps[i];					
            str = str+'<tr onclick="empClick('+row.id+')"><td align="center">'+row.lastName+' '+row.firstName+'</td>'
            str = str+'<td align="center">'+row.department+'</td></tr>'
        }
        str = str+'</table>'            			
        $('#searchResult').html(str);
    }   
}

async function addLocation(){
    var newloc = $('#locationinput').val()
    var location = allLocations.filter(loc=>{
        return loc.name== newloc;})
    if(!newloc){
        showRedAlert('Location can not be empty')
        return;
    }    
    if(location.length>0){
        showRedAlert('Location ('+newloc+') already exists!')
        return;
    }
    tempLocation.name = newloc;
    showyellowAlert('Add '+newloc+' to Locations?')
    while(!yellowFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(yellowAlertOK){
        insertLocation()
    }
    else{
        showRedAlert('Action cancelled')
        $('#locationinput').val('')
    }    
}

function insertLocation() {
	$.ajax({
		url: "libs/php/insertLocation.php",
		type: 'POST',
		dataType: 'json',
		data: {	
            name: tempLocation.name
        	},
		success: function(result) {	
                    clearAllInputs()								    
                    showGreenAlert('Added successfully'); 
                    allLocationsFlag = false;
                    getLocations();   
                    setsearchResultLocation();                                          						
		},        
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
}

async function addDepartment(){
    tempObject={};
    tempObject.name = $('#departmentInputSearch').val()
    tempObject.location = $('#departmentinputLocation').val()
    var department = allDepartments.filter(dep=>{
        return dep.name== tempObject.name;})
    if(!tempObject.name){
        showRedAlert('Department name can not be empty')
        return;
    }    
    if(tempObject.location<0){
        showRedAlert('Location can not be empty')
        return;
    }    
    if(department.length>0){
        showRedAlert('Department ('+tempObject.name+') already exists!')
        return;
    }

    showyellowAlert('Add '+tempObject.name+' to Departments?')
    while(!yellowFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(yellowAlertOK){
        insertDepartment()
    }
    else{
        showRedAlert('Action cancelled')
        $('#departmentInputSearch').val('')
        $('#departmentinputLocation').val('-1')
    }    
}

function insertDepartment() {
	$.ajax({
		url: "libs/php/insertDepartment.php",
		type: 'POST',
		dataType: 'json',
		data: {	
            name: tempObject.name,
            locationID: tempObject.location
        	},
		success: function(result) {	
                    clearAllInputs()								    
                    showGreenAlert('Added successfully'); 
                    allDepartmentsFlag = false;
                    getDepartments();  
                    setsearchResultDepartment();                                          						
		},        
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
}

async function addEmployee(){
    tempObject={};
    tempObject.firstName = $('#addfirstName').val()
    tempObject.lastName = $('#addlastName').val()
    tempObject.jobTitle = $('#addjobTitle').val()
    tempObject.email = $('#addemail').val()
    tempObject.department = $('#inputAddEmpDep').val()
    var employees = allEmployees.filter(emp=>{
        return emp.firstName== tempObject.firstName;})
    employees = employees.filter(emp=>{
        return emp.lastName== tempObject.lastName;})
    employees = employees.filter(emp=>{
        return emp.email== tempObject.email;})
    if(!tempObject.firstName){
        showRedAlert('First Name can not be empty')
        return;
    } 
    if(!tempObject.lastName){
        showRedAlert('Last Name can not be empty')
        return;
    } 
    if(!tempObject.email){
        showRedAlert('Email can not be empty')
        return;
    }   
    if(tempObject.department<0){
        showRedAlert('Department can not be empty')
        return;
    }    
    if(employees.length>0){
        showRedAlert('Employee '+tempObject.firstName+' '+tempObject.lastName+' ('+tempObject.email+') already exists!')
        return;
    }
    
    showyellowAlert('Add Employee '+tempObject.firstName+' '+tempObject.lastName+' (email: '+tempObject.email+') to Personnel?')
    while(!yellowFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(yellowAlertOK){
        insertEmployee()
    }
    else{
        showRedAlert('Action cancelled')
        $('#addfirstName').val('')
        $('#addlastName').val('')
        $('#addjobTitle').val('')
        $('#addemail').val('')
        $('#inputAddEmpDep').val(-1)
    }    
}

function insertEmployee() {
	$.ajax({
		url: "libs/php/insertEmployee.php",
		type: 'POST',
		dataType: 'json',
		data: {	
            firstName: tempObject.firstName, 
            lastName: tempObject.lastName, 
            jobTitle: tempObject.jobTitle, 
            email: tempObject.email, 
            departmentID: tempObject.department
        	},
		success: function(result) {	
                    clearAllInputs();
                    $('#inputAddEmpDep').val(-1);								    
                    showGreenAlert('Added successfully'); 
                    allEmployeesFlag = false;
                    getAllEmployees();                                            						
		},        
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
}

async function removeEmployee(){
    tempObject={};
    tempObject = allEmployees.filter(emp => {
        return emp.id == currentEmployeeId;
      })     
    showyellowAlert('Delete employee '+tempObject[0].firstName+' '+tempObject[0].lastName+' (email: '+tempObject[0].email+') from Personnel?')
    while(!yellowFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(yellowAlertOK){
        deleteEmployee()
    }
    else{
        showRedAlert('Action cancelled')
    }    
}

function deleteEmployee() {
	$.ajax({
		url: "libs/php/deleteEmployeeByID.php",
		type: 'POST',
		dataType: 'json',
		data: {	
            id: tempObject[0].id
        	},
		success: function(result) {	
                    clearAllInputs(); 						    
                    showGreenAlert('Deleted successfully'); 
                    allEmployeesFlag = false;
                    getAllEmployees();  
                    showAllEmployees();	                                          						
		},        
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
}

async function removeDepartment(arg){
    currentDepartmentId = arg
    tempObject={};
    EmpsInDep = allEmployees.filter(emp => {
        return emp.departmentId == currentDepartmentId;
      })     
    if(EmpsInDep.length>0){
        showRedAlert('Department must be empty to be removed');
        return;
    }
    tempObject = allDepartments.filter(dep=>{
        return dep.id == currentDepartmentId;
    })
    showyellowAlert('Delete '+tempObject[0].name+' from Departments?')
    while(!yellowFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(yellowAlertOK){
        deleteDepartment()
    }
    else{
        showRedAlert('Action cancelled')
    }    
}

function deleteDepartment() {
	$.ajax({
		url: "libs/php/deleteDepartmentByID.php",
		type: 'POST',
		dataType: 'json',
		data: {	
            id: currentDepartmentId
        	},
		success: function(result) {	
                    clearAllInputs(); 						    
                    showGreenAlert('Deleted successfully'); 
                    allDepartmentsFlag = false;
                    getDepartments();  
                    setsearchResultDepartment();	                                          						
		},        
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
}

async function removeLocation(arg){
    currentLocationId = arg
    tempObject={};
    DepsInLoc = allDepartments.filter(dep => {
        return dep.locationID == currentLocationId;
      })     
    if(DepsInLoc.length>0){
        showRedAlert('Location must be empty to be removed (move all departments from this location)');
        return;
    }
    tempObject = allLocations.filter(loc=>{
        return loc.id == currentLocationId;
    })
    showyellowAlert('Delete '+tempObject[0].name+' from Locations?')
    while(!yellowFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(yellowAlertOK){
        deleteLocation()
    }
    else{
        showRedAlert('Action cancelled')
    }    
}

function deleteLocation() {
	$.ajax({
		url: "libs/php/deleteLocationByID.php",
		type: 'POST',
		dataType: 'json',
		data: {	
            id: currentLocationId
        	},
		success: function(result) {	
                    clearAllInputs(); 						    
                    showGreenAlert('Deleted successfully'); 
                    allLocationsFlag = false;
                    getLocations();  
                    setsearchResultLocation();	                                          						
		},        
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
}


function modifyLocationClick(locId){
    addloc2();
    $('#locationAdd').addClass('d-none')
    $('#locationEdit').removeClass('d-none')
    $('#locationEditCancel').removeClass('d-none')
    getLocationById(locId);
}

async function modifyLocation(){
    var newloc = $('#locationinput').val()
    var location = allLocations.filter(loc=>{
        return loc.name== newloc;})
    if(!newloc){
        showRedAlert('Location can not be empty')
        return;
    }    
    if(location.length>0){
        showRedAlert('Location ('+newloc+') already exists!')
        return;
    }
    tempLocation.name = newloc;
    showyellowAlert('Update location '+currentLocation.name+' to '+newloc+'?')
    while(!yellowFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(yellowAlertOK){
        updateLocation()
    }
    else{
        showRedAlert('Action cancelled')
        $('#locationinput').val(currentLocation.name)
    }    
}

function updateLocation() {
	$.ajax({
		url: "libs/php/updateLocation.php",
		type: 'POST',
		dataType: 'json',
		data: {	
            name: tempLocation.name,
            id: currentLocation.id
        	},
		success: function(result) {	
                    clearAllInputs()								    
                    showGreenAlert('Updated successfully'); 
                    allLocationsFlag = false;
                    allDepartmentsFlag = false;
                    allEmployeesFlag = false;
                    getLocations(); 
                    getDepartments()  
                    getAllEmployees();
                    setsearchResultLocation();                                          						
		},        
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
}

function modifyDepartmentClick(depId){
    $('#departmentAdd').addClass('d-none')
    $('#departmentEdit').removeClass('d-none')
    $('#departmentEditCancel').removeClass('d-none');
    addDept2();
    getDepartmentById(depId)
}

function cancelUpdateDepartment(){
    $('#departmentAdd').removeClass('d-none');
    $('#departmentEdit').addClass('d-none');
    $('#departmentEditCancel').addClass('d-none');
    $('#addDept2').removeClass('d-none');
    $('#addDeptForm').addClass('d-none');    
    document.querySelector('#departmentinputLocation [value="-1"]').selected = true;
    $('#departmentInputSearch').val(''); 
}

async function modifyDepartment(){
    var newdep = $('#departmentInputSearch').val()
    var existsDep = allDepartments.filter(dep=>{
        return dep.name== newdep;})
    if(!newdep){
        showRedAlert('Department can not be empty')
        return;
    }     
    if($('#departmentInputSearch').val()<1){
        showRedAlert('Location can not be empty')
        return;
    }
    tempDep.name = newdep;
    tempDep.locationID = $('#departmentinputLocation').val();
    if(existsDep.length>0 && tempDep.locationID == currentDepartment.locationID){
        showRedAlert('Department ('+newdep+') already exists in this location!')
        return;
    }  

    showyellowAlert('Update Department '+currentDepartment.name+' (location id '+currentDepartment.locationID+') to '+newdep+' (location id '+tempDep.locationID+')?')
    while(!yellowFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(yellowAlertOK){
        updateDepartment()
    }
    else{
        showRedAlert('Action cancelled')
        $('#locationinput').val(currentDepartment.name)
    }    
}

function updateDepartment() {
	$.ajax({
		url: "libs/php/updateDepartment.php",
		type: 'POST',
		dataType: 'json',
		data: {	
            name: tempDep.name,
            id: currentDepartment.id,
            locationID: tempDep.locationID
        	},
		success: function(result) {	
                    clearAllInputs()								    
                    showGreenAlert('Updated successfully'); 
                    allDepartmentsFlag = false;
                    allEmployeesFlag = false;
                    getDepartments()  
                    getAllEmployees();
                    cancelUpdateDepartment();      
                    setsearchResultDepartment();                                    						
		},        
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
}

async function modifyEmployee(){
    var emparr = allEmployees.filter(emp => {
        return emp.id == currentEmployeeId;
      })  
    currentEmployee = emparr[0]
    tempObject={};
    tempObject.firstName = $('#editfirstName').val()
    tempObject.lastName = $('#editlastName').val()
    tempObject.jobTitle = $('#editjobTitle').val()
    tempObject.email = $('#editemail').val()
    tempObject.department = $('#editinputDepartment').val()
    var employees = allEmployees.filter(emp=>{
        return emp.firstName== tempObject.firstName;})
    employees = employees.filter(emp=>{
        return emp.lastName== tempObject.lastName;})
    employees = employees.filter(emp=>{
        return emp.email== tempObject.email;})
    if(!tempObject.firstName){
        showRedAlert('First Name can not be empty')
        return;
    } 
    if(!tempObject.lastName){
        showRedAlert('Last Name can not be empty')
        return;
    } 
    if(!tempObject.email){
        showRedAlert('Email can not be empty')
        return;
    }   
    if(tempObject.department<0){
        showRedAlert('Department can not be empty')
        return;
    }    

    if(employees.length>0 && tempObject.department == currentEmployee.departmentId && tempObject.jobTitle == currentEmployee.jobTitle && tempObject.email == currentEmployee.email){
        showRedAlert('Employee '+tempObject.firstName+' '+tempObject.lastName+' ('+tempObject.email+') already exists!')
        return;
    }
    var str = 'Update Employee '+currentEmployee.firstName+' '+currentEmployee.lastName+' (email: '+currentEmployee.email+', department id: '+currentEmployee.department+')'
    str = str + ' to '+tempObject.firstName+' '+tempObject.lastName+' (email: '+tempObject.email+', department id: '+tempObject.department+')?'
    showyellowAlert(str)
    while(!yellowFlag){
        await new Promise(r => setTimeout(r, 500));
    }
    if(yellowAlertOK){
        updateEmployee()
    }
    else{
        showRedAlert('Action cancelled')
    }    
}

function updateEmployee() {
	$.ajax({
		url: "libs/php/updateEmployee.php",
		type: 'POST',
		dataType: 'json',
		data: {	
            firstName: tempObject.firstName, 
            lastName: tempObject.lastName, 
            jobTitle: tempObject.jobTitle, 
            email: tempObject.email, 
            departmentID: tempObject.department,
            id: currentEmployee.id
        	},
		success: function(result) {	
                    clearAllInputs()								    
                    showGreenAlert('Updated successfully'); 
                    allEmployeesFlag = false; 
                    getAllEmployees();
                    showAllEmployees();
                                    						
		},        
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
		}
	}); 
}

function getLocationById(arg) {
    $.ajax({
        url: "libs/php/getLocationByID.php",
        type: 'GET',
        dataType: 'json',
        data: {	id: arg,	},
        success: function(result) {
            currentLocation = result.data[0]  
            $('#locationinput').val(currentLocation.name);             
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown)
            showRedAlert('Transaction failed')
        }
    }); 
};

function getDepartmentById(arg) {
 $.ajax({
     url: "libs/php/getDepartmentByID.php",
     type: 'GET',
     dataType: 'json',
     data: {	id: arg	},
     success: function(result) {           
             currentDepartment = result.data[0]  
             $('#departmentInputSearch').val(currentDepartment.name);
             document.querySelector('#departmentinputLocation [value="' + currentDepartment.locationID + '"]').selected = true;

     },
     error: function(jqXHR, textStatus, errorThrown) {
         console.log(jqXHR, textStatus, errorThrown)
         showRedAlert('Transaction failed')
     }
 }); 
};


function getEmployeeById(arg) {
 $.ajax({
     url: "libs/php/getEmpByID.php",
     type: 'GET',
     dataType: 'json',
     data: {	id: arg	},
     success: function(result) {										    
            currentEmployee = result.data[0]  
            currentEmployeeId = arg
            showEdit(arg);             						
     },
     error: function(jqXHR, textStatus, errorThrown) {
         console.log(jqXHR, textStatus, errorThrown)
         showRedAlert('Transaction failed')
     }
 }); 
};