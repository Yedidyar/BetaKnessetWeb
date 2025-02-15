import Dialog from "../Dialog";
import { Typography } from "@material-ui/core";

export default function AboutDialog(props: {
    open: boolean;
    setOpen: (value: boolean) => void;
}) {
    return (
        <Dialog {...props} closeText={"מגניב"}>
            <Typography color="primary" variant="h4" component="h4">
                אודות
            </Typography>
            <p>
                בטא מחוקקים הוא פרויקט קהילתי שהתחיל מהשאלה הפשוטה - מה עושים
                חברי הכנסת?
            </p>
            <p>
                כשגילינו ש
                <u>
                    <a
                        href="https://main.knesset.gov.il/Activity/Info/pages/databases.aspx"
                        rel="noreferrer"
                        target="_blank"
                    >
                        המידע של הכנסת זמין כבר מ-2016
                    </a>
                </u>{" "}
                ופתוח לכל, הבנו שיש פה הזדמנות לגשת להכל אחרת.
            </p>
            <ul>
                <li>
                    במקום לקבל פרפרזות מהתקשורת, אפשר לראות את{" "}
                    <b>ההקשר האמיתי</b>.
                </li>
                <li>
                    במקום להשען על מידע ממקורות לא ברורים, ניתן לבסס הבנה על סמך{" "}
                    <b>נתונים עובדתיים</b>
                </li>
                <li>
                    במקום שרוב חברי הכנסת יהיו דמויות עלומות ולא מוכרות, אפשר
                    לקרוא, לחקור ולהתעמק <b>במה שבאמת חשוב להם</b>.
                </li>
            </ul>
            <p>
                כלל הציטוטים המופיעים באתר זה חולצו בעזרת אלגוריתם שבנינו שעובר
                על פרוטוקולי המליאה והועדות של הכנסת החל משנת 2015.
            </p>
            <p>
                המידע בפרויקט זה מתעדכן באופן שוטף יחד עם מאגרי המידע של הכנסת
                מדי יום ועדכניות המידע תלויה בזמן עדכון הארכיונים של הכנסת.
            </p>
            <p>
                נציין כי אנו פועלים ללא מטרת רווח והפרויקט בלעדית למען הקהל
                הרחב, תודה מיוחדת{" "}
                <a
                    href="https://www.hasadna.org.il/"
                    rel="noreferrer"
                    target="_blank"
                >
                    לסדנא לידע ציבורי
                </a>{" "}
                שמאחסנת עבורנו חלק מהמידע ונושאת בעלויות תחזוקת האתר.
            </p>
            <p>
                אנחנו יותר מנשמח לקבל פידבקים ואנו מזמינים אתכם ליצור עמנו קשר.
            </p>
        </Dialog>
    );
}
