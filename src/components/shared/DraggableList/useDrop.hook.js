import { useState, useEffect } from 'react';

function useDrop({ ref, onDrop }) {
    const [ dropState, updateDropState ] = useState('DROPPED');

    function dragOverCb(e) {
        e.preventDefault();

        if (dropState !== 'DRAG_OVER') {
            updateDropState('DRAG_OVER');
        }
    }

    function dragEnterCb() {
        updateDropState('DRAG_OVER');
    }

    function dragLeaverCb() {
        updateDropState('DRAG_LEAVE');
    }

    function dropCb(e) {
        e.preventDefault();
        onDrop(e.dataTransfer.getData('source'));

        updateDropState('DROPPED');
    }

    useEffect(() => {
        const elem = ref.current;

        if (elem) {
            elem.addEventListener('dragenter', dragEnterCb);
            elem.addEventListener('dragover',  dragOverCb);
            elem.addEventListener('dragleave', dragLeaverCb);
            elem.addEventListener('drop', dropCb);

            return () => {
                elem.removeEventListener('dragenter', dragEnterCb);
                elem.removeEventListener('dragover',  dragOverCb);
                elem.removeEventListener('dragleave', dragLeaverCb);
                elem.removeEventListener('drop', dropCb);
            };
        }
    });

    return {
        dropState
    };
}

export default useDrop;
