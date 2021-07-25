// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    uint public taskCount = 0;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    // constructor() public {
    //     createTask("suntukan");
    // }

    function createTask(string memory _content ) public returns(uint) {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false);
        return taskCount;
    }

    function deleteTask(uint _id) external {
        delete tasks[_id];
    }

    function updateTask(uint _id, bool completed) external {
        tasks[_id].completed = completed;
    }
}
