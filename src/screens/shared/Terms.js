import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import Collapsible from "react-native-collapsible";
import { Entypo } from "@expo/vector-icons";

// Constatnts
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";

const policyContentData = [
  {
    id: 2,
    title: "Definitions",
    description:
      "Company - \"HappiMynd\", \"HappiMynd.com\",\"Company\", \"Firm\", \"we\", \"our\", \"us\", \"Service Provider\" or similar terminology are all in reference to HappiMynd Professional Services Pvt. Ltd. as a provider of Services for the remainder of this document. User - \"Client\", \"user\", \"you\", \"your\" or other similar terminology are all in reference to you as the user of the platform as a recipient of our products, Services and resources for the remainder of this document. Platform-\"Platform\" or similar terminology are all in reference to any mobile app, website, chat bot or web links that the User can employ to access Services provided by the Company. Psychological Wellness Professional -\"Psychological Wellness Practitioner\", \"Psychological Wellness Professional\", \"Wellness Professional\", \"therapist\", \"wellness advisor\", \"expert\", \"doctor\", \"consultant\" or similar terminology are all in reference to the Psychological Wellness Practitioner.",
  },
  {
    id: 3,
    title: "Nature of Service",
    description:
      "HappiMynd is a psychological wellness platform that delivers emotional wellness products and Services to individuals and organisations. These include, but are not restricted to, corporate wellness programmes through which employees of organisations avail various products and Services. HappiMynd offerings may include / are : Screening on Emotional Wellbeing & Personality parameters, Self-assessments and psychological tests, Online and face-to-face consultation with expert Psychological Wellness Professionals (who have been authorised by HappiMynd to use the platform for delivering their Services), Workshops and / or webinars delivered by trained Psychological Wellness Professionals, Self-help tools, content and programmes through a range of channels including, but not restricted to websites, mobile applications and emails. Guide chat packs where in clients may be able to exchange encrypted private messages with their Psychological Wellness Professional in addition to online consultation, Content Library (Audio visuals, Blogs, Articles etc). The Services offered by HappiMynd are in compliance with our client anonymity and confidentiality policies (refer to Privacy Policy). HappiMynd reserves the right to add or remove products and Services from its overall offerings without prior notification. The aforementioned shall hereinafter be referred to as \"Services\".",
  },
  {
    id: 3.5,
    title: "Disclaimer",
    description:
      "HappiMynd does not deal with medical or psychological emergencies. We are not designed to offer support in crisis situations - including when an individual is experiencing thoughts of self-harm or suicide, or is showing symptoms of severe clinical disorders such as schizophrenia and other psychotic conditions. In these cases, in-person medical intervention is the most appropriate form of help. If you feel you are experiencing any of these difficulties, or if you are considering or contemplating suicide or feel that you are a danger to yourself or to others, we would urge you to seek help at the nearest hospital or emergency room where you can connect with a psychiatrist, social worker, counsellor or therapist in person. The same applies in-case of any medical or psychological health emergency. We recommend you to involve a close family member or a friend who can offer support",
  },
  {
    id: 4,
    title: "User Agreement",
    description:
      "By choosing to visit and / or avail any Services and / or product and / or resource from HappiMynd, the user confirms that they are above 18 years of age and are not otherwise incompetent to contract under the Indian Contract Act, 1872 and are legally allowed to take decisions of their own. The user also accepts and agrees to our Terms and Conditions (hereafter referred to as \"User Agreement\") and those additional terms and conditions and policies referenced herein and / or available by hyperlinks. If You are between 13 and 18 years of age, please read through HappiMynd Privacy Policy and the HappiMynd Terms of Service with Your parent or legal guardian, and in such a case the Agreement shall be deemed to be a contract between HappiMynd and Your legal guardian or parent and to the extent permissible under applicable laws, enforceable against you. Anyone under 13 is strictly prohibited from creating an account and / or Using the Service. If your Institution specifies a different age restriction, such as at least 18 and above, as a condition of using this Service, that restriction shall apply rather than the one above. Please read the User Agreement carefully. The terms in the User Agreement are in effect upon your using or availing Services, resources or any product from the platform. Accessing the Service / platform on any medium, including but not limited to mobile phones, smartphones and tablets, is also subject to the terms of the User Agreement. We reserve the right to add, modify or remove sections from the User Agreement at any point in time during the course of the agreement with no prior notice. Continuing to use the HappiMynd platform, purchase of any Service, resource or product, forms an obligatory legal agreement between the user and HappiMynd. Liability to review the User Agreement from time to time lies with the user. Continuation of the use of the platform after revision of the User Agreement will be deemed to be an acceptance of the revised terms.",
  },
  {
    id: 4.5,
    title: "Applicability of Terms",
    description:
      "The general terms and conditions in the User Agreement are applicable to all present and future contracts established between the user and HappiMynd. This User Agreement applies to all users of the platform, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content. By availing any of our Services, the user irrevocably accepts all the obligations stipulated in the User Agreement, Terms of Services and Privacy Policy, other policies referenced herein; and agrees to abide by them. The User Agreement supersedes any previous oral or written terms and conditions that may have been communicated to you.",
  },
  {
    id: 5,
    title: "Termination of Agreement",
    description:
      "At any point during the term of the User Agreement, the user shall be entitled to terminate the User Agreement provided all outstanding payments are settled, if applicable. Upon termination of the User Agreement, there may still be some information saved on our servers regarding the user. Should the user wish to remove this information, they will have to contact their organisation to request the same of HappiMynd, in case they are accessing HappiMynd offerings through a third-party or organisation. In case the user has registered on our platform directly, they can write to HappiMynd at support@happimynd.com. HappiMynd will aim to process all such requests within 14 working days, in line with our Privacy Policy and subject to necessary compliance with applicable laws. Over the course of the term of the User Agreement, HappiMynd can choose to terminate the User Agreement without citing a reason. Any payment receivable by HappiMynd should be paid by the user in full within 30 days from the termination of the User Agreement. Any payment receivable by the user will be processed by HappiMynd as per our Refund Policy.",
  },
  {
    id: 6,
    title: "Terms of Services",
    description:
      "During the course of the User Agreement, it is expressly stated, understood and agreed by you (user) that you (user) shall abide by the following Terms of Services. You are 18 years of age or older, not otherwise incompetent to contract under the Indian Contract Act, 1872 and that your use of the platform shall not violate any applicable law or regulation; All registration information you submit - either to us directly or through your organisation - is truthful and accurate and that you agree to maintain the accuracy of such information; Your use of the platform is solely for your personal and non-commercial use. Any use of this platform or its content other than for personal purposes is prohibited. Your personal and non-commercial use of this platform shall be subjected to the following restrictions: You shall not modify any content of the platform; You shall not decompile, reverse engineer, or disassemble the content; You shall not delete or modify any content of the platform and / or Services, including but not limited to, legal notices, disclaimers or proprietary notices such as copyright or trademark symbols, logos, that you do not own or have express permission to modify; You shall not use the platform and / or Services in any way that is unlawful, or harms the Company or any other person or entity, as determined in the Company's sole discretion. You shall not reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contents on the platform through which the Service is provided, without express written permission by HappiMynd. You shall not post, submit, upload, distribute, or otherwise transmit or make available any software or other computer files that contain a virus or other harmful component, or otherwise impair or damage the platform and / or Services or any connected network, or otherwise interfere with any person or entity's use of the platform and / or the Services.",
  },
  {
    id: 7,
    title: "Intellectual Property",
    description:
      "The contents on the platform are for informational purposes only. HappiMynd disclaims all liability to any person for any loss or damage caused by dependence on any part of the platform. Third-party content appearing on the platform is the property of their respective owners and HappiMynd does not assert any rights in relation to the same. Such third-party content is used by HappiMynd subject to the fair use provisions of Indian copyright law and applicable provisions in other jurisdictions. HappiMynd asserts its copyright ownership on the remaining contents of this document. No information, content or material from the platform and/ or Services may be copied, reproduced, republished, uploaded, posted, transmitted or distributed in any way without an express written permission from HappiMynd.",
  },
  {
    id: 8,
    title: "Payment, Cancellation & Refund Policy",
    description:
      "By using the platform, the user agrees to pay all applicable fees and charges upfront to HappiMynd and also authorizes us to automatically deduct all applicable charges and fees from the payments made as and when such features are accessed on our platform. Further, the user agrees to be responsible for any telephone charges and/ or internet service fees that may be incurred in accessing HappiMynd Services. For more information on payment methods, charges and fees, the User shall refer to the Payment section on the platform. HappiMynd reserves the right to change any or all parts of the Payment policy without notice or liability to the user or any third party. All cancellations and refunds will be handled as per the Cancellation & Refund Policy of the Company. HappiMynd reserves the right to change any or all parts of the Cancellation & Refund Policy without notice or liability to the user or any third party. Payment - All applicable payments should be made prior to availing HappiMynd services. The user's session booking(s) will not be confirmed till the payment is received by HappiMynd. If you are accessing our services through your organisation, beyond any sessions that might be offered to you as part of HappiMynd's association with your organisation, the user's session booking(s) will not be confirmed till the payment is received by HappiMynd. Cancellation, Reschedule and Refund Policy - To maximize user satisfaction, HappiMynd strives to provide the best possible service. The user has the flexibility to Reschedule the session, Cancel the session, or Claim a refund on the cancelled session. If the session is cancelled at least 24 hours in advance of the scheduled session then the user can claim a 100% session refund or, if applicable, a 100% money refund. If it is cancelled after that then no session/money refund would be provided. All money refunds will be processed within 14 days. Please note that, depending on the bank, it might take longer for the amount to get credited to your account.",
  },
  {
    id: 9,
    title: "Privacy Policy",
    description:
      "Usage of our platform or online resources is subject to the Privacy Policy of the Company. Please read the Privacy Policy carefully. HappiMynd reserves the right to add, change, or remove sections from the Privacy Policy without notice or liability to any third-party.",
  },
  {
    id: 10,
    title: "Limitation of Liability",
    description:
      "HappiMynd does not guarantee that you will be accepted as a registered user at HappiMynd, or as a client by the Psychological Wellness Professionals on our platform. HappiMynd reserves the right to terminate your registration with our platform at any time without citing a reason. HappiMynd is a technology enabler that connects the user and the Psychological Wellness Professional. Further, the professional Service is dependent on the information provided by the user to the Psychological Wellness Professional and HappiMynd does not promise any outcomes based on counselling and therapy. HappiMynd does not guarantee the availability of the same Psychological Wellness Professional over any period of time. From the moment at which you book your appointment, HappiMynd acts solely as an intermediary between you and the Wellness Professional, transmitting the details of your booking to you and to the Wellness Professional. Counselling will take place at a frequency agreed between you and your Psychological Wellness Professional. We cannot guarantee that sessions will always take place with a particular frequency or on the same day of the week but will make every effort to meet your requirements. Over the course of your agreement, the Wellness Professional might determine that online counselling Services are not appropriate for some or all of your treatment needs and accordingly may elect to not provide online counselling Services to you. Similarly, the Wellness Professional shall be at the liberty to decide that additional help is needed for the user and shall choose to bring in an additional Wellness Professional. HappiMynd makes all efforts to verify the credentials of every Psychological Wellness Professional registered with it. However, HappiMynd is not responsible for any misrepresentation/fraudulent credentials or claims by the Psychological Wellness Professionals.",
  },
  {
    id: 11,
    title: "Disclaimer on Warranties",
    description:
      "You understand and agree that any interactions and associated issues with the Wellness Professional on the platform, is strictly between you and the Wellness Professional. You shall not hold HappiMynd and/ or the Wellness Professional responsible for any such interactions and associated issues. HappiMynd and/ or the Wellness Professional is not responsible for any outcome between you and the Wellness Professional you interact with. If you decide to engage with a Wellness Professional to provide Psychological wellness Services to you, you do so at your own discretion and risk. The Services and content, and all materials, information, products and Services included therein, are provided on an \"as is\" and \"as available\" basis without warranties of any kind. HappiMynd and its licensors and affiliates expressly disclaim all warranties of any kind, express, implied, or statutory, relating to the Services and content. In addition, HappiMynd and its licensors and affiliates disclaim any warranties regarding security, accuracy, reliability, timeliness and performance of the Services or that the Services will be error-free or that any errors will be corrected. No advice or information provided to you by breakthrough will create any warranty that is not expressly stated in these Terms of Service.",
  },
  {
    id: 12,
    title: "User Forums, Topics, Replies, Comments, Feedback and Other Submissions",
    description:
      "If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send or submit forum topics, replies, comments, creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, on our social media channels, or otherwise (collectively, \"comments\"), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments. HappiMynd however guarantees that all communication between the user and HappiMynd and / or the counsellor within the ambit of therapy shall be kept confidential, subject to compliance with applicable laws. You agree to not seek any other person's contact information through our platform. You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain libellous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website or application.",
  },
  {
    id: 13,
    title: "Entire Agreement",
    description:
      "The failure of us to exercise or enforce any right or provision of this User Agreement shall not constitute a waiver of such right or provision. This User Agreement and any policies or operating rules posted by us on this platform or in respect to the Services constitutes the entire agreement and understanding between you and us and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and us (including, but not limited to, any prior versions of the Terms of Service).",
  },
  {
    id: 14,
    title: "Termination",
    description:
      "The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes. This User Agreement is effective unless and until terminated by either you or us. You may terminate this User Agreement at any time by notifying us - directly, or if you are accessing the platform through a third-party, then through the respective third-party - that you no longer wish to use HappiMynd's Services, or when you cease using our platform, subject to settlement of all outstanding payments. If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of this User Agreement, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly we may deny you access to our Services (or any part thereof).",
  },
  {
    id: 15,
    title: "Errors, Inaccuracies and Omissions",
    description:
      "Occasionally there may be information on our platform or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product / Service descriptions, pricing, promotions, offers etc. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice (including after you have submitted your order).We undertake no obligation to update, amend or clarify information in the Service or on any related website/mobile application/platform, including without limitation, pricing information, except as required by law. No specified update or refresh date applied in the Service or on any related website, should be taken to indicate that all information in the Service or on any related website has been modified or updated.",
  },
  {
    id: 16,
    title: "Prohibited Uses",
    description:
      "In addition to other prohibitions as set forth in this User Agreement, you are prohibited from using the platform or its content: for any unlawful purpose; to solicit others to perform or participate in any unlawful acts; to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others; to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; to submit false or misleading information; to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet; to collect or track the personal information of others; to spam, phish, pharm, pretext, spider, crawl, or scrape; for any obscene or immoral purpose; or to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet. We reserve the right to terminate your use of the Service or any related website/mobile application/platform for violating any of the prohibited uses.",
  },
  {
    id: 17,
    title: "Disclaimer of Warranties; Limitation of Liability",
    description:
      "The following provisions set out our entire liability and your attention is in particular drawn to the provisions of this clause. We do not guarantee, represent or warrant that your use of our Service will be uninterrupted, timely, secure or error-free. You agree to indemnify HappiMynd against any breach in confidentiality. If you access HappiMynd through a third-party platform, you agree that HappiMynd cannot be responsible for any data breaches that occur due to any acts of commission or omission from the third-party platform. We do not warrant that the results that may be obtained from the use of the Service will be accurate or reliable. You agree that from time to time we may remove the Service (or part thereof) for indefinite periods of time or cancel the Service at any time, without notice to you. You expressly agree that your use of, or inability to use, the Service is at your sole risk. The Service and all products and Services delivered to you through the Service are (except as expressly stated by us) provided 'as is' and 'as available' for your use, and/or in keeping with HappiMynd's arrangement with your organisation, without any representation, warranties or conditions of any kind, either express or implied. In no case shall HappiMynd, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, Service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.",
  },
  {
    id: 18,
    title: "Indemnification",
    description:
      "You agree to indemnify, defend and hold harmless HappiMynd and our subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, Service providers, subcontractors, suppliers, employees and interns, harmless against any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of this User Agreement or the documents they incorporate by reference, or your violation of any law or the rights of a third-party. You agree to indemnify HappiMynd for any breach in confidentiality. If you access HappiMynd through a third-party platform, you indemnify HappiMynd against any data breaches that occur due to any acts of commission or omission from the third-party platform.",
  },
  {
    id: 19,
    title: "Grievance Redressal",
    description:
      "To address the grievances of the users, HappiMynd has set up a Grievance Redressal Forum. In case you are dissatisfied with any aspect of our Services, you may contact our Grievance Redressal Officer Ravi Kant Suman at support@happimynd.com. We assure you a time-bound solution not exceeding one month from the date of your complaint.",
  },
  {
    id: 20,
    title: "Jurisdiction",
    description:
      "Jurisdictional policies of HappiMynd have been drafted in accordance and compliance with Indian laws. Any and all disputes arising between the user and HappiMynd with regards to this User Agreement, including the interpretation of the terms of this User Agreement shall be subject to the exclusive jurisdiction of the courts at Gurgaon, India.",
  },
  {
    id: 21,
    title: "Miscellaneous",
    description:
      "Survival: In the event of termination or expiration of these Terms for any reason, any provisions of these Terms that by their nature should survive termination of these Terms will survive termination of these Terms, unless contrary to the pertinent provisions herein stated. Severability: In the event that any provision of this User Agreement is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service; such determination shall not affect the validity and enforceability of any other remaining provisions. Unenforceability: If any provision of these Terms or any word, phrase, clause, sentence, or other portion thereof should be held to be unenforceable or invalid for any reason, then provided that the essential consideration for entering into these Terms on the part of any Party is not unreasonably impaired, such provision or portion thereof shall be modified or deleted in such manner as to render these Terms as modified legal and enforceable to the maximum extent permitted under applicable laws. No Waiver: No delay or omission by either Party hereto to exercise any right or power occurring upon any noncompliance or default by the other party with respect to any of the terms of these Terms shall impair any such right or power or be construed to be a waiver thereof. The terms and conditions of these Terms may be waived or amended only in writing or mutual agreement of the Parties.",
  },
];

const Terms = (props) => {
  // Prop Destructuring
  const { navigation } = props;

  // State Variables
  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggleItem = (index) => {
    setExpandedIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <Text style={styles.title}>Terms Of Engagement</Text>

        {/* Body Section */}
        <View>
          {policyContentData.map((data, index) => (
            <View key={data.id}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.accordionContainer}
                onPress={() => toggleItem(index)}
              >
                <View style={styles.accordionRow}>
                  <Text style={styles.accordionTitle}>{data.title}</Text>
                  <Entypo
                    name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                    size={hp(2.5)}
                    color="#4A4A4A"
                  />
                </View>
                <Collapsible collapsed={expandedIndex !== index}>
                  {/* Sized Box */}
                  <View style={{ height: hp(1.6) }} />
                  <Text style={styles.accordionDescription}>
                    {data.description}
                  </Text>
                </Collapsible>
              </TouchableOpacity>
              {/* Sized Box */}
              <View style={{ height: hp(2.6) }} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scroll: {
    paddingHorizontal: wp(3.8),
  },
  scrollContent: {
    paddingBottom: hp(12),
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsSemiBold",
    color: colors.primaryText,
    marginTop: hp(3.2),
    marginBottom: hp(3.9),
  },
  accordionContainer: {
    backgroundColor: "#EEE8FF",
    borderWidth: 1,
    borderColor: "#D3D0DD",
    borderRadius: hp(2.6),
    paddingHorizontal: wp(5.7),
    paddingVertical: hp(3),
  },
  accordionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionTitle: {
    fontSize: RFValue(18),
    fontFamily: "PoppinsSemiBold",
    color: "#111111",
    flex: 1,
    paddingRight: wp(2),
  },
  accordionDescription: {
    fontSize: RFValue(14),
    fontFamily: "Poppins",
    color: "#606060",
    lineHeight: hp(3),
    textAlign: "justify",
  },
});

export default Terms;