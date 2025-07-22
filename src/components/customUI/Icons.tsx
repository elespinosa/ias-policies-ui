import { AlertCircle, Banknote, BanknoteX, Building2, CircleCheckBig, CircleX, CreditCard, 
    DollarSign, Download, Edit, Euro, Eye, FileDown, FileText, FileUp, HandCoins, Handshake, Mail,
    PhilippinePeso, PoundSterling, RefreshCw, Shield, Trash, Upload, UserRound, UserRoundCheckIcon, 
    UserRoundX, UserSearchIcon, Printer } from "lucide-react"


export const Icons = (
    iconName: string,
    className: string = "mr-2 h-4 w-4"
) => { 
    switch (iconName) {
        case "active":
            return <UserRoundCheckIcon className={className} />;
        case "alert":
            return <AlertCircle className={className} />;
        case "cash":
        case "check":
        case "applyPayment":
            return <Banknote className={className} />;
        case "corporate":
            return <Building2 className={className} />;
        case "bank_transfer":
        case "credit-card":
        case "credit_card":
        case "debit_card":
            return <CreditCard className={className} />;
        case "delete":
            return <Trash className={className} />;
        case "download":
            return <Download className={className} />;
        case "edit":
            return <Edit className={className} />;
        case "email":
            return <Mail className={className} />;
        case "file-download":
            return <FileDown className={className} />;
        case "file-text":
        case "fileClaim":
            return <FileText className={className} />;
        case "file-upload":
            return <FileUp className={className} />;
        case "inactive":
            return <UserRoundX className={className} />;
        case "individual":
            return <UserRound className={className} />;
        case "joint":
            return <Handshake className={className} />;
        case "mark-overdue":
            return <CircleX className={className} />;
        case "mark-paid":
            return <CircleCheckBig className={className} />;
        case "payment":
            return <HandCoins className={className} />;
        case "print":
            return <Printer className={className} />;
        case "prospect":
            return <UserSearchIcon className={className} />;
        case "renew":
            return <RefreshCw className={className} />;
        case "refunded":
            return <BanknoteX className={className} />;
        case "shield":
            return <Shield className={className} />;
        case "upload":
            return <Upload className={className} />;
        case "view":
            return <Eye className={className} />;
        case "peso":
            return <PhilippinePeso className={className} />;
        case "dollar":
            return <DollarSign className={className} />;
        case "euro":
            return <Euro className={className} />;
        case "pound":
            return <PoundSterling className={className} />;
        default:
            return null;
    }
}
