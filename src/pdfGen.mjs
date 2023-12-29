import puppeteer from "puppeteer";
import path from "path";
import handlebars from "handlebars";

const generatePDF = async (data) => {
  const templatePath = path.join(__dirname, "./templates");
  const templateHtml = fs.readFileSync(
    path.join(templatePath, "template.html"),
    "utf8"
  );
  const template = handlebars.compile(templateHtml);
  const html = template(data);

  var milis = new Date();
  milis = milis.getTime();

  const pdfPath = path.join(
    __dirname,
    "../generated/pdf/",
    `${data.name}-${milis}.pdf`
  );

  const pdfOptions = {
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
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
};

export default generatePDF;
