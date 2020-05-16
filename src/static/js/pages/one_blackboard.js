function startEditing() {
    document.querySelector('.blackboard-wrapper').classList.add('editing');
}


function saveChanges() {
    document.querySelector('.blackboard-wrapper').classList.remove('editing');
    const value = document.querySelector('textarea').value;
    document.querySelector('.blackboard-preview').innerHTML = value;
}