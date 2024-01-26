import React from 'react';

function Info() {
    return (
        <div className="view">
            <h2>Author Informations</h2>
            <p>Name: <b>Ej Sobrepeña</b></p>
            <p>Email: <b><a href="mailto:ej.sobrepena@tuni.fi">ej.sobrepena@tuni.fi</a></b></p>
            <p>Course implementation: <b>5G00DM05-3005 Full Stack Web Development</b></p>
            <br />
            <div>
                <p>First step to make the app working is of course to install required dependencies by running "npm install"</p>
                <p>To run the app just simply give the command "npm start" or "npm run dev"</p>
                <p>To run the simple backend server you can run "npm run json-server"</p>
                <p>If for some reason the app is not working properly please make sure that the json-server is running as it's possible that it suddenly just stops. After running the json-server again please refresh the page too just in case.</p>
            </div>

            <h2>Short Instructions for Using the Application</h2>
            <p>
                Using the application should be intuitive and straightforward. The UI hints help the user to figure out how to use the application. You can start by creating tasks, adding tags, and tracking your time.
            </p>

            <h2>Estimate of Working Hours</h2>
            <p>
                I estimate that I spent approximately 80 hours working on this programming assignment.
            </p>

            <h2>Considerations and Reflection</h2>
            <p>
                While developing this application, I focused on creating an intuitive user interface that allows users to easily manage tasks and track their time. I considered the use of external content and ensured proper attribution and licenses. Challenges included implementing features like single-task mode and drag-and-drop functionality.
            </p>
        </div>
    );
}

export default Info;
