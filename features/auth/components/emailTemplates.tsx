import {
  Html, Head, Body, Container, Section,
  Text, Link, Img, Hr
} from "@react-email/components";

export function TemplateLink(text: string, url: string, linkText: string) {
  return (
    <Html lang="en">
      <Head />
      <Body style={bodyStyle}>
        {/* Header */}
        <Section style={headerStyle}>
          <Img
            src="http://cdn.mcauto-images-production.sendgrid.net/6584bb4d580949db/2e198f27-f382-41cd-84cc-b84e1bc543c8/32x32.png"
            width={32}
            height={32}
            alt="Scheduler logo"
            style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
          />
          <Text style={headerTextStyle}>Scheduler</Text>
        </Section>

        {/* Body */}
        <Section style={contentStyle}>
          <Text style={messageStyle}>{text}</Text>
          <Link href={url} style={buttonStyle}>
            {linkText}
          </Link>
        </Section>

        {/* Footer */}
        <Hr />
        <Section style={footerStyle}>
          <Text style={{ fontSize: "0.85rem", color: "#555" }}>
            If you didn't start any process with us, please omit this e-mail
          </Text>
        </Section>
      </Body>
    </Html>
  );
}

export function TemplateNoLink(text: string) {
  return (
    <Html lang="en">
      <Head />
      <Body style={bodyStyle}>
        <Section style={headerStyle}>
          <Img
            src="http://cdn.mcauto-images-production.sendgrid.net/6584bb4d580949db/2e198f27-f382-41cd-84cc-b84e1bc543c8/32x32.png"
            width={32}
            height={32}
            alt="Scheduler logo"
            style={{ display: "inline", verticalAlign: "middle", marginRight: 8 }}
          />
          <Text style={headerTextStyle}>Scheduler</Text>
        </Section>

        <Section style={contentStyle}>
          <Text style={messageStyle}>{text}</Text>
        </Section>

        <Hr />
        <Section style={footerStyle}>
          <Text style={{ fontSize: "0.85rem", color: "#555" }}>
            If you didn't start any process with us, please omit this e-mail
          </Text>
        </Section>
      </Body>
    </Html>
  );
}

// --- Styles ---
const bodyStyle = {
  fontFamily: "Arial, Helvetica, sans-serif",
  backgroundColor: "#ffffff",
};

const headerStyle = {
  backgroundColor: "#f1f1f1",
  padding: "30px",
  textAlign: "center" as const,
};

const headerTextStyle = {
  display: "inline",
  fontSize: "1.5rem",
  fontWeight: "bold",
  verticalAlign: "middle",
};

const contentStyle = {
  backgroundColor: "#dddddd",
  padding: "40px 20px",
  textAlign: "center" as const,
};

const messageStyle = {
  fontSize: "1.5rem",
  textAlign: "center" as const,
};

const buttonStyle = {
  color: "white",
  padding: "0.8rem 1.2rem",
  background: "linear-gradient(to top right, #7c3aed, #3b82f6)",
  textDecoration: "none",
  borderRadius: "1rem",
  fontWeight: "500",
  fontSize: "1.2rem",
  display: "inline-block",
};

const footerStyle = {
  padding: "10px",
  textAlign: "center" as const,
};