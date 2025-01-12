export default function AssignmentEditor() {
    return (
        <div id="wd-assignments-editor">
            <label htmlFor="wd-name"><strong>Assignment Name</strong></label><br/><br/>
            <input id="wd-name" value="A1 - ENV + HTML"/><br/><br/>
            <textarea id="wd-description" cols={45} rows={10}>
        The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page.
      </textarea>
            <br/>
            <table border={0} align="center">
                <tbody>
                <br></br>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-points">Points</label>
                    </td>
                    <td>
                        <input id="wd-points" value={100}/>
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-group">Assignment Group</label>
                    </td>
                    <td>
                        <select id="wd-group">
                            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
                        </select>
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-display-grade-as">Display Grade as</label>
                    </td>
                    <td>
                        <select id="wd-display-grade-as">
                            <option value="Percentage">Percentage</option>
                        </select>
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-submission-type">Submission Type</label>
                    </td>
                    <td>
                        <select id="wd-submission-type">
                            <option value="Online">Online</option>
                        </select><p></p>
                        <label>Online Entry Options</label><br/>

                        <input type="checkbox" id="wd-text-entry"/>
                        <label>Text Entry</label><br/>

                        <input type="checkbox" id="wd-website-url"/>
                        <label>Website URL</label><br/>

                        <input type="checkbox" id="wd-media-recordings"/>
                        <label>Media Recordings</label><br/>

                        <input type="checkbox" id="wd-student-annotation"/>
                        <label>Student Annotation</label><br/>

                        <input type="checkbox" id="wd-file-upload"/>
                        <label>File Uploads</label>
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td align="right" valign="top">
                        <label htmlFor="wd-assign-to">Assign to</label>
                    </td>
                    <td>
                        <label htmlFor="wd-assign-to">Assign</label><br></br>
                        <input type="text"
                               value="Everyone"
                               id="wd-assign-to"/>
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td></td>
                    <td>
                        <label htmlFor="wd-due-date">Due</label><br></br>
                        <input type="date"
                               value="2024-05-13"
                               id="wd-due-date"/>
                    </td>
                </tr>
                <br></br>
                <tr>
                    <td></td>
                    <td>
                        <label htmlFor="wd-available-from">Available from</label><br></br>
                        <input type="date"
                               value="2024-05-06"
                               id="wd-available-from"/>
                    </td>
                    <td>
                        <label htmlFor="wd-available-until">Until</label><br></br>
                        <input type="date"
                               value="2024-05-20"
                               id="wd-available-until"/>
                    </td>
                </tr>
                </tbody>
            </table>
            <hr/>
            <div align="right">
                <button>Cancel</button>
                <button>Save</button>
            </div>
        </div>
    );
}
