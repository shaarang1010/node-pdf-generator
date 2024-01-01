import puppeteer from "puppeteer";
import path from "path";
import handlebars from "handlebars";
import fs from "fs";

const generatePDF = async (data) => {
  const templatePath = path.join(process.cwd(), "./src/templates");
  const templateHtml = fs.readFileSync(
    path.join(templatePath, "pod.html"),
    "utf8"
  );
  const template = handlebars.compile(templateHtml);
  const html = template(data);

  const randomNum = Math.floor(Math.random() * 10);

  const fileName = `${data.name}-${randomNum}.pdf`;

  const pdfPath = path.join(process.cwd(), "./generated-pdfs/", fileName);

  const pdfOptions = {
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  const page = await browser.newPage();

  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: "networkidle0",
  });

  await page.pdf(pdfOptions);
  await browser.close();

  return fileName;
};

export default generatePDF;
