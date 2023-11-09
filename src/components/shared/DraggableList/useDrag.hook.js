import {
    useState,
    useEffect
} from 'react';


function useDrag({ id, ref, onDragStart, onDragEnd }) {
    const [ dragState, updateDragState ] = useState('DRAGGABLE');

    function dragStartCb(e) {
        updateDragState('DRAG_START');
        e.dataTransfer.setData('source', id);

        if (onDragStart) onDragStart(id);
    }

    function dragOverCb(e) {
        e.preventDefault();
    }

    function dragEndCb() {
        updateDragState('DRAG_END');
        if (onDragEnd) onDragEnd();
    }

    useEffect(() => {
        const elem = ref.current;

        if (elem) {
            elem.setAttribute('draggable', true);
            elem.addEventListener('dragstart', dragStartCb);
            elem.addEventListener('dragover', dragOverCb);
            elem.addEventListener('dragend', dragEndCb);

            return () => {
                elem.removeEventListener('dragstart', dragStartCb);
                elem.removeEventListener('dragover', dragOverCb);
                elem.removeEventListener('dragend', dragEndCb);
            };
        }
    }, []);

    return {
        dragState
    };
}

export default useDrag;
