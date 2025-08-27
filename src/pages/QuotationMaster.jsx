import React, { useEffect, useState } from "react";
import { getAllQuotations, deleteQuotation, getQuotationById, updateQuotation, createQuotation } from "../api/api";
import { useNavigate } from "react-router-dom";
import leaf from "../assets/Greenleaf.png";

function QuotationMaster() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState(null);

  const navigate = useNavigate();

  const fetchQuotations = async () => {
    try {
      const res = await getAllQuotations();

      if (res.length > 0) {
        setQuotations(res);
      }
    } catch (err) {
      console.error("Failed to fetch quotations", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteQuotation(id);
    fetchQuotations();
  };

  const handleEdit = (id) => {
    navigate(`/quotation/edit/${id}`);
  };

  const handleView = (id) => {
    navigate(`/schedule/quotation/${id}`);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      {/* Header + Banner */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-6">
        <div className="lg:w-2/3">
          <h2 className="text-3xl font-extrabold text-green-800 mb-2">🧾 Quotation Master - कोटेशन यादी</h2>
          <p className="text-green-700 text-sm">येथे सर्व तयार केलेले कोटेशन्स व्यवस्थापित करा. आपण नवीन कोटेशन तयार करू शकता किंवा विद्यमान कोटेशन पहा/हटवा.</p>
        </div>

        {/* Banner placeholder */}
        <div className="lg:w-1/3 w-full">
          <div className="rounded-xl overflow-hidden border border-green-200 shadow-lg h-40 sm:h-52">
            <img
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSEhMTFhUWFxYWFRgXFRYVFRUVFRUXFhUVFRgYHSggGBolHRUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0OGhAQGy0lICUwLS0vLS0tLSstLy0tLy0tLy0tLS8tLS0tLS0tLS0tLS0rLSstLS0tKy0tLS0tKy0tLf/AABEIAJgBTQMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAAAAQIDBAUGB//EAD4QAAIBAwIEAwUHAgQFBQAAAAECEQADIRIxBCJBUQUTYTJxgZGhBhRCUrHR8CPBBxWC4TNyksLxQ1NiorL/xAAZAQACAwEAAAAAAAAAAAAAAAAAAQIDBAX/xAAuEQACAgEDAgMIAgMBAAAAAAAAAQIRAxIhMQRRE0HwIjJhcbHB0fGBoQWR4TP/2gAMAwEAAhEDEQA/AOqWxUgsVZDelP8AhWs5ZVFmnraqyFpwSgCAWqkW3Uwt04LQBGtupVSlC08LSGCrT1oFOBpDHA08NUF+9pWfgPef16mPSovuYfLiffk/E/tA7AUDvsXZorOdTZggnR+JegHcdjWkKbQ4yvZhppQtKBTopEhukUvlinClmkOiM26abY7VPNFAUVDZHamGzV8LQbdOxaLKCrThVs2ab5NFi0UQCnaRUvl0aKB0MFulFsVIFp2mkOiMW6eLVPC1IopNk1Eh8unBanApdNKyWkhC04CpIpKTY6FC07QKTVSh6RJUMNkUz7uKn1UE0DpFZuFU9B8qgueHqa0DSUWxOEWYt3w0Cq7cLFdAyVVu8GScEfKpKRVLEvI5wU8GmKaeKvoxWSKakBqIU4Uh2Sg04GoxT1FFErHilApBThSoY4UmsfUCegJiAfmPnUVy7mB8TEmd9KjqYIknAkb7VAbF3J1nJB2U7bdI6D5UULU/Il8STlBH4WDH3QQf1n4VYs3AwkVW4bizq0XAJOxGx9COhqytkDaB6RIoocXbtFfxDK6RknHxO1XVWIHbFIF6/tj3U8UmSS3sBTgaQUtImKDTgabSxQMdRSRSxQMWaWabS0hjgaUNTaWgdjpogUlKKBhppdNE0s0hi6acopoNOBpMaHhaWKQNTw1QJqhsUaakkUoilY6ItNIVqaKNNOw0kOmk01Ppo00rDSRAetSAetOC0aaVjoSKTTT4ooGcKrelPDelRBPX6U5V7/2racVEq3RTw4pikU8UEh6tUimogn8kU6COlIluTg09agU+lSKaRJFbwttQ1Hf9zJ+pNaArMRTbcgDlOR8enwq+jz0NNoIPair4qvLPUbfCtBDIB7gH51S4myXIU4HX0H+9XqT4HH3mxaUUlOqJcFLQBTopDClpIpaAFoopYoGFFKBSxQMKUURSxSGJS0sUsUhiUtLppYpDEilAp0UoFKx0IBSxSilpWSoQClinAU6KRKhgpwNOilApWNIQGnTRFQ8Ze0IzgTpUtHeBNRbpWOieiq/A8Wt1FuIZDCR+1WKUZKStDCiiq/E8UEies/T/AM0pSUVbA4oKT2+dSC13H1FaZ8PtjPmN/q/goSyOjK3w/Ymt2pHJ8Jrkzwop4U+tX1Vuik/6DQvmnZP/AKlf1o1D0FIA+tSIvvqzxOoKSQBt+LO47ViXuPYHAn5n+9CdiktPJrBffTwvvrE4LxVhcUNIUmDBJGcAwxMGY2xBOK3bvFW1MFjPbln40O0OMotWGkddvUYqEu5/4cx6s39iI93zjapeJvK1lmUzj+41T8Jq3wSKUEFdu9RbosUNToo2OIKkK6hZ2IyCexnYmrwU/wAApnjFgeUZInpGc1oJw5gZEwJx169ai5Lksjjd0UtFO8urZsGjy27UtRPwysLdL5VWRPaln0o1D0IreXRpqyCKcAKWoagVtNGmregdqNApayWgq6aWKs6BS+VRrDQVopYqx5NAs0tSDQyCKWKmFqjRRqHpIgKcBTxbpdFKx6SOKWnaKSKB0FLRSigYUtEUsUgCnUgFLFIYtNYTTqKQzgfDvHV4K83CvhA2BmTqeNQnsSMDGkj3V3oNec/4h2xav+aVT+taa3LkhZUa4gAyf6adJOoL7um+xHiXn8MCTJR2tlttUGQQDsIYD4Vz+lbxzlifC4Jy3VnQ1yH278R8o2RO+v8A7a66vI/8aONK3rCjojz8SKs62OvFo7/v7Cg6dncJ4i3cj3Cf705eMJ3Z/mBVFVPapFU12NKOUpyNIcQD3/6/3ptxger/AAcf2NU1WnhTUdKJa2JxFpmVgHY4wGaZPQb965ZbkMa62OprmvEApc6dixjr749CZPxqcSjMuGLxHCEifd9cU3S7El5JJJJ9kkmJ2EdB06CrNgSVHQZPvjAq1xKnSdIE7bgQDuTTsjovcreHXzabOUbdZ6ek9f3rf4G0CJtNqXtq5l9CCK5k3GuOEVZY4AXM/sPWuq8G8JFmWY6nYcxzpA3gD+5+lV5HRb06bdeRMODJILdOkznpOB8quoD3Pz/3pwoiqW2zfGCjwLqNGo0QaINRLBZNJB/gFEe6nfCgBgQ0vl0+fSl+FKwoZ5f8miDT6Wix0Mk0s06KIpAJSfOnRRFADQvvpdIpYoigBNNEUsUtAxIpKdRQA0Us0tEUAFFFFABRRRQAUUlBoA537d8C13hLmkaiqty45hGVhsHIUwd9Nc7/AIb32S61qGVGsq6q4AYMugMRGCvOFBkjkwYye/4m0HUr3Ee71Fed/ZTgDw3idxSZVxeVM5wbd35QzD3hqw5YqOeMu/6JL3aPRy1eLf4tvr43T+VF+tezXGABJiACT7hXin2ntNxnG3rlvbTaOcGGSVqXVzScV839vuVt+yz0QAVKorPQt+cfI1OjH/3B8jXXswUXVqtxvHhOUb9fT0z1qLiuJ8tS2sHsB+I9v50rEt6myTkySe5OSfnNNKyvJPTsuS699n3+uTUlngic/XrTeGsmfaFXOKsXGCotzSGJ1MsEgKpOJEZjrVebJ4cHLn1QY4Ob3GuLdpdVx0RRuzuqCfexAmqXEXTpBGdQOQZG5IyNxVHxP7K3L1trVzi0YTqRzw9suh6EEECYJEiJmpPBvBDw1gWTd80gsdWnQMnYLLQPick7bUsM5y9+NfzZPJCOnZmx9m8JIuqjliDNtSD+VS2DPoSPSd66C3xJUhbmnOFZZ0k9iDlTXH8De8tiCAQQTESCBlkI6ggGOxjuZ6BrMf0ieRwdB30MOaAe2NS9tJ9Kc47jwz9mkbYYd/rTgw7isvg7pZATvsf+YGG+oNWRUNJqWTYugjvTh76pClFJxJay7S1UE04VHSSUizRUApZNKh6iaiowTTgaKHY6ikpaQwooooAKKKKACiiigAooooAKKKKACiiq/E8ZbtiXYKPUxUZSjFXJ0NJvgnJpJrF43xdtLeWu2A0hQMAg84AO/u9e1K14hxd3mRbYTPMDq6bkkhcSDykj175n1kOIJy+RLw35nUTSE1zNrjr5SVurdBOLiKMRvIVmVgN9xWhwHG3CgJ03NwWQFdMTEoxJ9MZnp2lHqVJ1Vf6E4UXOB8Qt3gTbYNpMGOhrzL7Q+InhvFLbQCoLaWDGdWsLo0naBcZTuDM4gR0/2R422L99dHl+ayOmoMhuSGDAI2xBGQOr+6uM+0fBuvG3L95Tps37ZC8xLqQWV1MZ1gi2Y6nbess8injhJ89/p/PBLTTaPUvHr2jh7r5OlS0Dc6cxnGYivN/sdZHn8ZJkKbNsHeTaVkP6Cu18e48NwC3mwGFlyI3llfQewJwfQ1yX2S4E27bajqdjrcxHM0yPpWb/ACOTdtdl9bKpOkkb6au5+dVvFePayFgAlj1nYROx9RWQvHsD/wAZ/n/vn61Tt3nv3GLMSqzBJnlnp2Jj+RXbeZS9mD3ZXhjG3Ka2W7Nvib3mkHMQIB9YJn1/arHD8Me1ZFu96xV3h7inHxPQCOpzWiWaMdmznwi5yujbscP6VYuuilVJyJaOoUK0k/A1yniPFMxCqxztPQD2nPcCRjuQOs1a8OUE3NMlVsMuTtICIJ7kavl0kViz59UdK9bnXxdIorVI6RrUwRkHII6g5FV+ItQJOAOvSsfwlwSzFsA6BGMj2iY7bfA1W8SvOXQhmgvG5ysNg96uXUKviUS6f23HsTX2WQykGGH0OQa6fgLbXOFtsMuEUj1e3j5EqQfQmuGD6TpGZE/9Jj/u+ldh4FxiixahiMfCZJI/WrZ5FpTbMuKFZJLyNLwoq3mEbF5X3PbR/wBWNXxbFeY+PfaO5aNxLLMF1s0rhmGo6QP0+Vd9wXFMLaC683AqhzAALgAMR8Zql5FdWbljcYJvzNLyxRoFVBxS/mNPF9O5peJHuKizpFBj0quLiUBko8SHce5N5i9x86XzF7j51CXTvRKGjXDuG5L5y/mX5inhgdqrlkpNdunrh3DctUVXF5e9L5y9zS1x7jJ6KgPEL3p3nr3o1x7gS0VCeIXvQOIXvRrj3AmoqA8Svej70tJ5IrzAnoqt98XvThxK96Xiw7gT0VD95Wo7nHIJkgQCTkYA3Puo8WHcdEnFXSqkgSQJjqfdXDeM/aIi4VRbJuEARpFxrZOfMuMpIgSsKJJLD0qP7U/aK4ASiHTci2mrVJLbt5cSRkAdzj/motw6WbRu3U5zDuoZZVnbTaN3eDkQNR2ODk1yeozvLurr1vxZphj08jF4GQz8a7NZgMLd+5/SdwCytdJkHMcimOh1RUt/7XOFPl3c49q3pRZk8gQiZ2ho2ExJNYfGWrt+4nmLIULqdjqKB1ZnYKckhVEIFEcgyQa6Hhm4XjLEWeHt8OkoFuXNKvcCxEKEaZ2gkEkdacYvTs6/q/7LGor3kYhv3iUucPY0kgw3lW7dvU/tCE1KymRlm3PQjOx4ceLY6rtm4LoDabgLAMCZyLbN5g2kqCROD1Gtwf2Us/8AqcRcYkyVQi2D1giST7sVpXfArMg27t9IMkBw4J9fMDEbnYjc96lDC/elX+/2VTnHhNnC+LcFct3Dxdlnd7ZN27ZZWRmK6CXWVxhZIiRnGCKk8Z8XbjC108ilU8lIEvDObLMTufO8vAxuNxNdZ414ReuBPLvAlNQXUuhyHEMNS8s7RyiIzM4898P8K4uw6IvlOgtG9aYgjl5AsWyp/qLe0XCswCxMwQBGcJKLin8fLhfgS0vc6/xW+f8AK+GXcXERebfK8p98UzwC7qRmEczSPdpX/euN8R+0d67YW0+kCxzLA0g+XcRUIAAgc0RG3Sun+xx08NbBP4R+/wChFZOsvTq+X0M8lUkcqeIAOIhSCMd5BkQPT0k10Hg9oC0xG5Yg/wCkCP1NcqCGXUkFwzcpBEsCrKScRiYB7qYIBrX8K47yyVPstE+h7iuz08lDImymGGWTDNR52/kucSCJOQBO3wjPSl4bxZVXSRy7k5JPqe/8irTwfcawfEvBA0xsemYM7yK25MKe6M/S5I45e1yalrxa0lsuw3GphBYqv4UMTAAOekknrVvh/FuHWzdXzSk6dZZWQ4bXdaGgqICiTsCvQV574h4PdV/NWTcnLliZTTpKMhBDSCRBOmDtuSW7wC22PmchKMRbUkWsi4TMGSC4DpLR8JyyxUdiOaMkd/b8StXEu3LV22wVWRNJEQqamiNhzAf6as8SoDWwTIVsdPZtOB+9ee+HcZbucUbpu6TcU3HUKqC5pEtMlgCVXBwVbVETFb33osbTW3a4ktGhbl0hvLWCWnIhxPL7VwdINJKmOTTRuPGvGIQfVsf/AJNSi66rynChTPSDj5zHyNVOCtkqbjCCQBJJyBJGOm5+dHifHqE8u3kbk9zVmaqjZhw4fEc0vh9zLu3J4i2BmbiTPo2on5An0rpk8QJ67xBzGqRg9ciT2yPQ1yfBRrZpzGkYn2p2HcmB8fWr444BdRLONPLB1SvKRE5yNR0xsFJisWWVyDqJrUoryOhHiZ/MfTMEkAEquc/CeuQMh3+YNvqgd9yeXMCMQSOvYYEViWbsjUCJg5BjAyDnGQoPQyDQL5gHodOm5iNWBGmJMyT0EDEg1UUajd/zN8gEyOmrAO4DGZk/Hr8ZB4k0kajIkHeQRkY7/TNYa8UpjRo/EMNgFRLMWzJBn4EmMzTzdaFKHAaGwcJiQAduUjABnpiix6mbb+Jsu5GQPgczJY42GPX5O/zJpgtkdOvu2BmJx6DNc5b4om2HghVksRkjB5mUMRHMCJHQT0FSWp9sQGAyoMFcahyH2jzapgnL57sWtm+3iOJY4mN8EYOOnz/vTF48iInGJ9TBkz8fn76yDxQ1HORMcuoqyyBIPKxG3VtvUUWOKgpqMAwIyQvvzBH/AMsbe6ix6jcXjmMAHIAxB2IwQAPSPT5EofEGiZwZgz6SQMjp1xvWIL2AGncRnBBXn0Ax1MTHXfsn3rl0mQTqZDB0BdM7AEGN47fRWPUzbHHt+sQR+UEL2GTH/mlfj2A9oY39NjO/9/SDWL99BMyFBMDOnIEALJMHmnP5T6VHa4vAJJSA5IxmCVgyBIlTjrK52osWo2/v75J6b+m3T5Un+YN0I69cnIE/WsrVAwNsHcx7W+5O0T6VHc4nG4I3xEEN7OJ5gJgd8UrDUzZbjWmJg/vsTt/DUH3tiPa+pjr+/wClZrXTzdB3B6dYPQ77bfCkN8deuxO5P8j6UWFs0RxjfmOdu9L/AJg/Q/zud4rNLzmfT5dT299VeJ4sgAKJZthvgZnHT4ihyocdUnSNjiPFio1M8LMbtkkEAQMseuBNS8Pwod7mu48uiteiAiBBpFuSMHmIPrMDrWNwnF5NzGu1yIdLFfvNwZiTHKoYwdpUxNaXFXtLC2OS3/TZ5zcvaidCv1liXJX8qbCaz5Z2q9evM6OLE8fz+hX8U8Y0q9y2PbbQlxiQ+kSH8pF9hY0qCDq3+HMPeu+cwMKNzzAvpuKdOASycsLJiVGMYroOMv8AO9xg7E/01xuYLGNlGzyTsAxmYpb4UuzG2guPoLsPb1LbVVBMdNKiOnvox8cc+vXxLZ5YwjqRm/5Z5yN57NDtrCKdMQdXMTJM9jsD3yNVLdtRpVBEQBJwFwAknAGnYHpUWucf2kAT17/+Ka14CZgQR2MiBAHxP0PrV6S4OZLqMkndmgvFkE8zc0AgvcYN2YAloA0jPSpbXiLqoDEnTGGLOx2JBfUGIEdJzPeskcSTPSIMCfZicz1jSYPantc3aepBkxpgn2jjVlQR6H5uiHiyfmao8RfcMQPfJXoA2M9ebrjG4rN4ziGUBlMFLhPpHEkgg9dPmNr3GLQ2qBrh9rtAwNWT3kkQQwJ9GNT3LQdHUYW4ly115bhBZABv7SqF9GYZik6rcljk2zmPGbiuLz6izcyyYAC+cpFsL+HSFAIn8MRXa/Zfhl+62tTRKKw9ZRR/2/WuC+2via3DYZLZtzZdrkpo1O7gM23Nm2TO1dw9u4tmwluBpRQd/wAiEbD1NZ8sbjFPa75+BdN72efWv6ukPiGZGEg+zpESTgHUJHoe01b4PCLBkRykzlZOk+uIz1wetVLjDQGQjWpERKiNIjJBJ7TM4BxJixwkkGYMMwEAAcp0mAABEhv3NdF8D6D/ANKXY6zw9zpGoT/PpV0cPPsnPY5+u4+tY3CcUVUDpVyz4nDZxVuPLKPDNmXpoZfeiWOJ4UjDrHY7g/Gs294RbcnpgyQSCZxBI3ETitTifE10EkiI+FZ/2av+ejO5I1O2kYwsgL02gT/qrXHqYS2mjmz/AMflhvif8My2+xyHVpuOoeQwXSBB9oRp2PUbGB2rV4fwKzbKs5LlQNMxAgRMCAT6md60LwC7NPwj+9Y3G+IkYHzolkxcpjhi6p7Nf2ix4jxc/oBWLfvZAHX6ACST7gCfhTL/ABPc5/m9VuGuLrJuQIMHV01LCzGVB1QSOhjcRWTJk1M2UumxPuya7xegCVMEc+lmiGOepgELBjtvvU924VdlIJ0qogEySqhie8grpAAxp6giobjyh1DS4LBCQoQjQul+bETIIGQI2MESC4GYlQAuozGpQZWTBb3CDtkEms7RydLLKXbscq51ENjOyvqHpiQJnMfhycLxDOqOG3PQyXWZfmEDCx1wOomDTtuXbJZCLhVtLLqkBRykEQYZCfX6WfNLqWJLDA8yCS41EsARl58uZ6iDmcLhC3slXiYBdWcHVIg+zJyvXlgRJnc7ZktXS06cDWxdgCeZQdbENImCoJzO+KgChZBYAEKqgkGNTFkYM3cx2O5IGaW2TpGox+VpyxErpCbhgSR2GkHE5Qb+Zf8AvIU6nb+pODmRPQxtnV3Ajtki8VLAAcxBO8iSrORkCCsA4APYCsziLYt8zRuARLEgnlAXBMk6sCdm23qwraSpcndgxkZcyzezuIzqwCJzSpDtlyzfOhdatzCAYA5s79ASBE93nqYVuIBVSwGqNJZTMwxZYXGoFZmSTjI2IpHidxJMGWIPtkxIJBgTMSOx26uF5RGqAoNshjjTiNXoZSMmIOd6XA0y3Y4gDRcgAmROJdegYK0bNAPZegot8QWhV2bMgmGbSsBVwQPZn3z1xANB1LgFCDpEtqU6hHLuRCg9Dt60a9GmSSAx/Jq9qc9FMqBj8npSCyU3iWk6ozpRo1AnAbHdQZJ2wKs3HKspaV2yNR1KXAJEnmlWnbeJiYNK3xIBJMu4LlTpZBrcFRFtwAFDFTgmIkz0XzSEOSGGnoDoIMBSQAG5lQgEARHeih8Ew44ajM5061herESFIzHOd87ZFPFyAZYkydLkDTEMJYZwMYA+A6Q+c0h4AUNMSSpCliVGkkGck46kDY0xroUyAw3SBpUMoIYMSWlmEg/hMnP5aOREhuplhoCyY3ALNpGJPUxFLZvTLPIkyQdTBdJEEfHPrPzgd4jURJAIBOCQGkyJgKuqOkmMYlbXEMMt7XXlwSAdBJJ7ER07ZzSAle/Bg40jUQQysFLRpIM9VIncaTsJhnh/EnW14E6V1QVOkmAFe4T0AWM/mfHsxTOIugI+o+ysTkGNJCrO0GJnoGIIqEPptmwMeaQxljCow1AHtIta4xGoTGo1XN7HQ6PHftPz4Og8Ge3b4YG4dVsGUQALzK4ZjC9F0qCT1YLio+P3BAHmXDcuMMAF2mLYMyApJJPQE5yZk4qwAeG4UoFZEDPMRrYa2IAxHtHG533FM4rSbpEgGIuSIFsIAoUiPyA6hJwIxkipc36/expm09n3/wC1+RGvQgBAlVi3IgEtAN2GwcyQOmNszUt8RMaGGRvvIBYTkmeuJJHmDqMwcXxIY5DBZXShYMy6sg6snUTB3znuKga+sQAJyYG0liW0iTBlm37QIq+CpHLz5NcvkW1bUoQbgkST1KCZ74PyJ+IYJIBkE7AyTA6Cfy4z091UzcDMpDgpIUyY2wwB2iZzncVLwl027a6cglSGOSpEyJJPZfedFTSZSWGSIICt+ErJIXbVtjVCnHZWE9KhuEZkMNxvqblnnMzB9me8E4qo2biKDI9oxkezgatmypEg9/fUu/XrOBnJGTzQYIn2gw09d6eli1F0X5OZIDGYIAII1YO8AKcCcgdgS9OIKqxjImQokWyoZkI9zJ26kdcULobUWAUlhzFQdW8sUyCvsgdJn4091jmUmCScwvtKdM6tmBI74jvFRlFUSjNp32OX+06Dzmj813tiXwojoBEdN4r0b7N3WHDWMjUbNomY9koAu/uI+FcD4rwOosLOpgmeYczMQpuDA2BY/Kug8fshXt2+luyiD/Szj+wqnPBZIRgbW6kYKqrFQiyDrLloI9ocu2xjoFIxgTV+2mf5vRRW6fJs6CCWPUuWWiSKgu5EfXtRRQuDWuTNa62xJZe0GCRkAxtMb7Vd8Jv3E5M7kyREg5Bj1oooZhhmlPq3F8K0ajXCQSayrpJoooRvKtwSdOepMRMATipA1x2gBAhbSxXUJlSwg765UbHHSAKKKTdHF6+TeWuxQZX0lp6ArIAEnUw9/wCGYEZYZip7wXX5KqpSbbYiGgErH4TIcEx6bjdaKknZhfBYvsPLLK39RSAAgjAts4yVb8LDO/s7RhouMzNbaTpaZWFSUBOoQAO5B6EDJGKWio8Jlr2HLeDaWZzJbUQBAIWQLYjaFMSOgAOSZW47oDmTqA3OIBQBxIkGASOuDjBooprkqbehyB+IIUF1KkyMCDACWwY6GcDaSdt6DdhXY6lCFSIOnTOpVGRjSSPeHAI5qKKgqdEqJOGYXCp9gkyWZiNMsNEAdAzap9PXDmdVDKFJ0Qshp1liwIOkiBKsZ7zmM0UVKcaIwfsWQC8wJWVZFzmYgcoeNhEMfWCQKufeVIVHDBmkrGn2WWZIiB+PABjSO1FFKkxXSBeIJ0klWKLLkayp0wSZmMiSfWexliO1sGF1641xHLq2iSYMlZkTOetJRUJLSTW7JQ0uUAhWuNJLElmY6WYQoXMjGIJ6E1C3EyjaC0ggnEgkZhZEBQCRHp8KKKaQrux54hTLFdoU4kHctA6xAPX2c9KFvAgrJhVDTAaQrIGPaQYO8HVGKSihRQk9hLo1hV/Cyl3gaRtpVRgyTAxOxjrNbHgnhqi+vmoS3K52bXNwIqucganIE4ICjocpRWWTblp+f2/J3opRxql6pstLeDcbda9dBFoEs5wDq5QAoOAQWgT0GOasfivEmZrjpg3SbjMdoxykj00KDtB2MmUoq3FG4qXwX5OVnySUpRT839a+iC8ABEgqAIBOkFlAGvIz6AbjsTVZmbQXK5EERBgTmZJJgKevvmcFFWLZGde0hzyIAhyJMmJB0sAGnbZTq3yYjJM3DHGBpAGQFJhiR1wYBYSNgdiehRUmJc0NVgRbyCfbzpkQAcLEdA07+/AqRnQ6ojTOoapkxmSRtGTI2iegooqD9f2O2I1zlIkwY1RhmKgMA2/MdImO0Uj3VPMxEaQrLqA0mGAU9+ggdGPqaKKFGxjLHEr95gzLLZQQN2cPbznoqn4gVH9r7zecAu4XPuOR+pooquEV4q+Rsfl8j//Z"
              alt="Krishi Quotation Banner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Quotation Table */}
      <div className="bg-green-50 border border-green-300 rounded-xl shadow-lg overflow-x-auto">
        {loading ? (
          <p className="p-6 text-green-800">Loading quotations...</p>
        ) : (
          <table className="w-full text-sm text-green-900 min-w-[600px]">
            <thead className="bg-green-200 text-green-900 text-left">
              <tr>
                <th className="px-4 py-3 border border-green-700 text-center">#</th>
                <th className="px-4 py-3 border border-green-700 text-center">Crop Name</th>
                <th className="px-4 py-3 border border-green-700 text-center">Acres</th>
                <th className="px-4 py-3 border border-green-700 text-center">Created At</th>
                <th className="px-4 py-3 border border-green-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {quotations.length > 0 ? (
                quotations.map((q, index) => (
                  <tr key={q._id} className="hover:bg-green-100 transition">
                    <td className="px-4 py-2 border border-green-300 text-center font-semibold">{index + 1}</td>
                    <td className="px-4 py-2 border border-green-300 text-center">{q.cropName}</td>
                    <td className="px-4 py-2 border border-green-300 text-center">{q.acres}</td>
                    <td className="px-4 py-2 border border-green-300 text-center">
                      {new Date(q.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-2 border border-green-300 text-center space-x-2">
                      <button onClick={() => handleView(q._id)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-xs">
                        📄 View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDeleteId(q._id);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-xs"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6">
                    कोणतेही कोटेशन उपलब्ध नाही.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white border border-green-600 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-green-100 p-2 rounded-full shadow-md">
              <img src={leaf} alt="Leaf" className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-green-700 text-center mt-6 mb-4">आपण हा कोटेशन खरंच हटवू इच्छिता का?</h2>

            <p className="text-center text-gray-600 mb-6">ही क्रिया कायमची आहे आणि पूर्ववत केली जाऊ शकत नाही.</p>

            <div className="flex justify-end space-x-3 pt-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md shadow-sm">
                रद्द करा
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedDeleteId);
                  setShowDeleteModal(false);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow-md"
              >
                हटवा
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuotationMaster;
