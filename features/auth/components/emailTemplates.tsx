export function TemplateLink(text: string, url: string, linkText: string) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <style>{`
                * {
                box-sizing: border-box;
                }
                
                body {
                font-family: Arial, Helvetica, sans-serif;
                }
                
                /* Style the header */
                .header {
                background-color: #f1f1f1;
                padding: 30px;
                text-align: center;
                font-size: 35px;
                }
                
                /* Container for flexboxes */
                .row {
                display: -webkit-flex;
                display: flex;
                }
                .column {
                padding: 10px;
                height: 300px;
                }
                
                /* Left and right column */
                .column.side {
                -webkit-flex: 1;
                -ms-flex: 1;
                flex: 1;
                }
                
                /* Middle column */
                .column.middle {
                -webkit-flex: 2;
                -ms-flex: 2;
                flex: 2;
                justify-items: "center";
                }
                
                /* Style the footer */
                .footer {
                background-color: #f1f1f1;
                padding: 10px;
                text-align: center;
                }
                
                .action-button {
                    color: white;
                    padding: 0.8rem;
                    margin: 0.5rem;
                    background-image: linear-gradient(to top right, oklch(54% 0.281 293.009), oklch(62.3% 0.214 259.815));
                    width: fit-content;
                    text-decoration: none;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    border-radius: 1rem;
                    font-weight: 500;
                    font-size: 1.5rem;
                }
                
                /* Responsive layout - makes the three columns stack on top of each other instead of next to each other */
                @media (max-width: 600px) {
                .row {
                    -webkit-flex-direction: column;
                    flex-direction: column;
                }
                }
                `}
                </style>
            </head>
            <body>
                <div className="header">
                <h2><img src="http://cdn.mcauto-images-production.sendgrid.net/6584bb4d580949db/2e198f27-f382-41cd-84cc-b84e1bc543c8/32x32.png" width="32" height="32"/> Scheduler</h2>
                </div>
                
                <div className="row">
                <div className="column side" style={{backgroundColor:"#ddd"}}></div>
                <div className="column middle" style={{backgroundColor:"#ddd", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                    <p style={{textAlign:"center", fontSize:"1.5rem"}}>${text}</p>
                    <a href={url} target="_blank" className="action-button">${linkText}</a>
                </div>
                <div className="column side" style={{backgroundColor:"#ddd"}}></div>
                </div>
                
                <div className="footer">
                <p>If you didn't start any process with us, please omit this e-mail</p>
                </div>
            
            </body>
        </html>        
    )
}
export function TemplateNoLink(text: string) {
    return (
        <html lang="en">
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <style>{`
                * {
                box-sizing: border-box;
                }
                
                body {
                font-family: Arial, Helvetica, sans-serif;
                }
                
                /* Style the header */
                .header {
                background-color: #f1f1f1;
                padding: 30px;
                text-align: center;
                font-size: 35px;
                }
                
                /* Container for flexboxes */
                .row {
                display: -webkit-flex;
                display: flex;
                }
                .column {
                padding: 10px;
                height: 300px;
                }
                
                /* Left and right column */
                .column.side {
                -webkit-flex: 1;
                -ms-flex: 1;
                flex: 1;
                }
                
                /* Middle column */
                .column.middle {
                -webkit-flex: 2;
                -ms-flex: 2;
                flex: 2;
                justify-items: "center";
                }
                
                /* Style the footer */
                .footer {
                background-color: #f1f1f1;
                padding: 10px;
                text-align: center;
                }
                
                .action-button {
                    color: white;
                    padding: 0.8rem;
                    margin: 0.5rem;
                    background-image: linear-gradient(to top right, oklch(54% 0.281 293.009), oklch(62.3% 0.214 259.815));
                    width: fit-content;
                    text-decoration: none;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                    border-radius: 1rem;
                    font-weight: 500;
                    font-size: 1.5rem;
                }
                
                /* Responsive layout - makes the three columns stack on top of each other instead of next to each other */
                @media (max-width: 600px) {
                .row {
                    -webkit-flex-direction: column;
                    flex-direction: column;
                }
                }
                `}
                </style>
            </head>
            <body>
                <div className="header">
                <h2><img src="http://cdn.mcauto-images-production.sendgrid.net/6584bb4d580949db/2e198f27-f382-41cd-84cc-b84e1bc543c8/32x32.png" width="32" height="32"/> Scheduler</h2>
                </div>
                
                <div className="row">
                <div className="column side" style={{backgroundColor:"#ddd"}}></div>
                <div className="column middle" style={{backgroundColor:"#ddd", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
                    <p style={{textAlign:"center", fontSize:"1.5rem"}}>${text}</p>
                </div>
                <div className="column side" style={{backgroundColor:"#ddd"}}></div>
                </div>
                
                <div className="footer">
                <p>If you didn't start any process with us, please omit this e-mail</p>
                </div>
            
            </body>
        </html>        
    )
}