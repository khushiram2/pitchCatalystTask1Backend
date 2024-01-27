const { sign } = require("jsonwebtoken")
const { default: puppeteer } = require("puppeteer")


module.exports={
    genNewLink:async (id)=>{
        const token= await sign({id:id},process.env.SECRET_KEY,{expiresIn:"15d"})
        const link=`http://localhost:5173/sub-user/contract/${token}`
        return link  
    },
    createpdf:async(url)=>{
    try {
        const browser = await puppeteer.launch();
        const webPage = await browser.newPage();
        await webPage.goto(url, {
            waitUntil: 'networkidle0',
        });

        const pdfBuffer = await webPage.pdf({
            printBackground: true,
            displayHeaderFooter: true,
            format: 'Tabloid',
            landscape: true,
            margin: {
                top: '10px',
                bottom: '20px',
                left: '10px',
                right: '20px',
            },
        });

        await browser.close();
        return pdfBuffer
    } catch (error) {
        console.error('Error generating or sending PDF:', error);
    }
}
}
