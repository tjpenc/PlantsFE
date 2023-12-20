import { Button, Card } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { completeTask, deleteTask } from '../../api/taskData';

export default function BigTaskCard({ taskObj, onUpdate }) {
  const [isComplete, setIsComplete] = useState(taskObj.isComplete);
  const [taskCompletionDate, setTaskCompletionDate] = useState(taskObj.dateCompleted);
  const [taskColor, setTaskColor] = useState();
  const [priorityString, setPriorityString] = useState();
  const deleteThisTask = () => deleteTask(taskObj.id).then(onUpdate);
  const completeThisTask = () => completeTask(taskObj.id).then((task) => {
    setIsComplete(true);
    setTaskCompletionDate(task.dateCompleted);
  });

  const calculateDaysUntilDue = () => {
    const today = new Date().toJSON().slice(0, 10);
    const deadline = taskObj.deadline?.slice(0, 10);
    const daysDifference = (Date.parse(deadline) - Date.parse(today));
    const days = Math.ceil(daysDifference / (1000 * 60 * 60 * 24));
    return days + 1;
  };
  const daysUntilDue = calculateDaysUntilDue();

  const setTaskInfo = () => {
    if (taskObj.priority === 1) {
      setTaskColor('red');
      setPriorityString('High');
    } else if (taskObj.priority === 2) {
      setTaskColor('orange');
      setPriorityString('Medium');
    } else if (taskObj.priority === 3) {
      setTaskColor('green');
      setPriorityString('Low');
    }
  };

  useEffect(() => {
    setTaskInfo();
  }, [taskObj.id]);

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body className="d-flex flex-column">
        <Card.Title>Created {taskObj.dateCreated?.slice(0, 10)}</Card.Title>
        {isComplete
          ? <Card.Subtitle className="mb-2 text-muted">Completed: {taskCompletionDate?.slice(0, 10)}</Card.Subtitle>
          : (
            <>
              <Card.Subtitle className="mb-2 text-muted"><div style={{ color: `${taskColor}` }}>Priority: {priorityString}</div></Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">Deadline: {taskObj.deadline?.slice(0, 10)}</Card.Subtitle>
              <Card.Subtitle className="mb-2 text-muted">Days Until Due: {daysUntilDue}</Card.Subtitle>
              <div className="mt-4 mb-3">
                <Button variant="success" onClick={completeThisTask}>Complete Task</Button>
              </div>
            </>
          )}
        <Card.Text className="border-top mt-3">
          {taskObj.description}
        </Card.Text>
        <div className="mt-auto border-top">
          <Button variant="light" onClick={deleteThisTask}>
            <Card.Img variant="top" src="/delete.png" alt="delete" style={{ height: '20px', objectFit: 'cover', borderRadius: '3px' }} />
          </Button>
          <Link passHref href={`/tasks/edit/${taskObj.id}`}>
            <Button variant="light">
              <Card.Img variant="top" src="/feather-pen.png" alt="edit" style={{ height: '20px', objectFit: 'cover', borderRadius: '3px' }} />
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}

BigTaskCard.propTypes = {
  taskObj: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    deadline: PropTypes.string,
    priority: PropTypes.number,
    dateCreated: PropTypes.string,
    isComplete: PropTypes.bool,
    dateCompleted: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};
