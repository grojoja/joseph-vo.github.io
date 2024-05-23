document.getElementById('courseForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting in the traditional way
  
    // Fetch values from input fields
    var semester = document.getElementById('semester').value;
    var classCode = document.getElementById('classCode').value;
    var className = document.getElementById('className').value;
    var instructor = document.getElementById('instructor').value;
  
    // Add new row to the table
    var table = document.getElementById('courseTable');
    var newRow = table.insertRow();
    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);
    cell1.innerHTML = semester;
    cell2.innerHTML = classCode;
    cell3.innerHTML = className;
    cell4.innerHTML = instructor;
  
    // Clear the form fields
    document.getElementById('semester').value = '';
    document.getElementById('classCode').value = '';
    document.getElementById('className').value = '';
    document.getElementById('instructor').value = '';
  });
  