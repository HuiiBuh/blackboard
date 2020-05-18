class OneBlackboard {

    static saveListener = null;

    static startEditing() {

        document.querySelector('.blackboard-wrapper').classList.add('editing');

        if (OneBlackboard.saveListener) return;

        OneBlackboard.saveListener = new EventListener(document, 'keydown', (event) => {
            if (event.key === 'Escape') {
                OneBlackboard.saveChanges();
            }
        });


    }


    static saveChanges() {
        document.querySelector('.blackboard-wrapper').classList.remove('editing');
        const value = document.querySelector('textarea').value;
        document.querySelector('.blackboard-preview').innerHTML = value;
    }
}
