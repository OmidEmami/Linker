import React, { useRef } from 'react';

import jsPDF from 'jspdf';
import styles from "./TestPdf.module.css"
const TestPdf = ({id})=> {
    return (
        <div id={id} className={styles.mainContainer}>
<p>سلام امید امامی</p>
<p>سلام امید امامی</p>
<p>سلام امید امامی</p>
<p>سلام امید امامی</p>

      {/* Add the content of your component here */}
    </div>
    )
}

export default TestPdf
