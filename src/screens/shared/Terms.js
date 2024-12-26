import React from "react";
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
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Constatnts
import { colors } from "../../assets/constants";

// Components
import Header from "../../components/common/Header";

const policyContentData = [
  // {
  //   id: 1,
  //   title: "Introduction",
  //   description:
  //     "At HappiMynd, we are committed to respecting the privacy and confidentiality of the information that you entrust us with. Our Privacy Policy outlines the policies and procedures regarding the collection, use and disclosure of Personal Information from users. Please review this Privacy Policy carefully. In order to guarantee privacy to the client, we maintain the client’s anonymity and work in accordance with confidentiality policies to ensure that all personal and health information received is maintained and transmitted through a highly secure environment. It is recommended that you do not use the website, mobile application(s) or the related Services if any of the terms of this Privacy Policy are not in accordance with the applicable laws of your country.",
  // },
  {
    id: 2,
    title: "Definitions",
    description:
      "Company - “HappiMynd”, “HappiMynd.com”,“Company”, “Firm”, “we”, “our”, “us”, “Service Provider” or similar terminology are all in reference to HappiMynd Professional Services Pvt. Ltd. as a provider of Services for the remainder of this document. User - “Client”, “user”, “you”, “your” or other similar terminology are all in reference to you as the user of the platform as a recipient of our products, Services and resources for the remainder of this document. Platform-“Platform” or similar terminology are all in reference to any mobile app, website, chat bot or web links that the User can employ to access Services provided by the Company. Psychological Wellness Professional -“Psychological Wellness Practitioner”, “Psychological Wellness Professional”, “Wellness Professional”, “therapist”, “wellness advisor”, “expert”, “doctor”, “consultant” or similar terminology are all in reference to the Psychological Wellness Practitioner.",
  },
  {
    id: 3,
    title: "Nature of Service",
    description:
      "HappiMynd is a psychological wellness platform that delivers emotional wellness products and Services to individuals and organisations. These include, but are not restricted to, corporate wellness programmes through which employees of organisations avail various products and Services. HappiMynd offerings may include / are : Screening on Emotional Wellbeing & Personality parameters, Self-assessments and psychological tests, Online and face-to-face consultation with expert Psychological Wellness Professionals (who have been authorised by HappiMynd to use the platform for delivering their Services), Workshops and / or webinars delivered by trained Psychological Wellness Professionals, Self-help tools, content and programmes through a range of channels including, but not restricted to websites, mobile applications and emails. Guide chat packs where in clients may be able to exchange encrypted private messages with their Psychological Wellness Professional in addition to online consultation, Content Library (Audio visuals, Blogs, Articles etc). The Services offered by HappiMynd are in compliance with our client anonymity and confidentiality policies (refer to Privacy Policy). HappiMynd reserves the right to add or remove products and Services from its overall offerings without prior notification. The aforementioned shall hereinafter be referred to as “Services”.",
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
      "By choosing to visit and / or avail any Services and / or product and / or resource from HappiMynd, the user confirms that they are above 18 years of age and are not otherwise incompetent to contract under the Indian Contract Act, 1872 and are legally allowed to take decisions of their own. The user also accepts and agrees to our Terms and Conditions (hereafter referred to as “User Agreement”) and those additional terms and conditions and policies referenced herein and / or available by hyperlinks. If You are between 13 and 18 years of age, please read through HappiMynd Privacy Policy and the HappiMynd Terms of Service with Your parent or legal guardian, and in such a case the Agreement shall be deemed to be a contract between HappiMynd and Your legal guardian or parent and to the extent permissible under applicable laws, enforceable against you. Anyone under 13 is strictly prohibited from creating an account and /  or Using the Service. If your Institution specifies a different age restriction, such as at least 18 and above, as a condition of using this Service, that restriction shall apply rather than the one above. Please read the User Agreement carefully. The terms in the User Agreement are in effect upon your using or availing Services, resources or any product from the platform. Accessing the Service / platform on any medium, including but not limited to mobile phones, smartphones and tablets, is also subject to the terms of the User Agreement. We reserve the right to add, modify or remove sections from the User Agreement at any point in time during the course of the agreement with no prior notice. Continuing to use the HappiMynd platform, purchase of any Service, resource or product, forms an obligatory legal agreement between the user and HappiMynd. Liability to review the User Agreement from time to time lies with the user. Continuation of the use of the platform after revision of the User Agreement will be deemed to be an acceptance of the revised terms.",
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
      "During the course of the User Agreement, it is expressly stated, understood and agreed by you (user) that you (user) shall abide by the following Terms of Services. You are 18 years of age or older, not otherwise incompetent to contract under the Indian Contract Act, 1872 and that your use of the platform shall not violate any applicable law or regulation; All registration information you submit - either to us directly or through your organisation - is truthful and accurate and that you agree to maintain the accuracy of such information; Your use of the platform is solely for your personal and non-commercial use. Any use of this platform or its content other than for personal purposes is prohibited. Your personal and non-commercial use of this platform shall be subjected to the following restrictions: You shall not modify any content of the platform; You shall not decompile, reverse engineer, or disassemble the content; You shall not delete or modify any content of the platform and / or Services, including but not limited to, legal notices, disclaimers or proprietary notices such as copyright or trademark symbols, logos, that you do not own or have express permission to modify; You shall not use the platform and / or Services in any way that is unlawful, or harms the Company or any other person or entity, as determined in the Company’s sole discretion. You shall not reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contents on the platform through which the Service is provided, without express written permission by HappiMynd. You shall not post, submit, upload, distribute, or otherwise transmit or make available any software or other computer files that contain a virus or other harmful component, or otherwise impair or damage the platform and / or Services or any connected network, or otherwise interfere with any person or entity’s use of the platform and / or the Services. You acknowledge that when you access a link that leaves the platform, the site you enter into is not controlled by the Company and different Terms of Services and privacy policies may apply. By accessing links to other sites, you acknowledge that the Company is not responsible for those sites. The Company reserves the right to disable links from third-party sites to the platform, although the Company is under no obligation to do so. You agree that you shall pay all applicable fees on time. In case of late payment, HappiMynd reserves the right to levy a charge / interest on the outstanding amount. You take responsibility to check the technical specifications required before making a booking for a session or before availing any of the other digital offerings.",
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
    description: `By using the platform, the user agrees to pay all applicable fees and charges upfront to HappiMynd and also authorizes us to automatically deduct all applicable charges and fees from the payments made as and when such features are accessed on our platform. Further, the user agrees to be responsible for any telephone charges and/ or internet service fees that may be incurred in accessing HappiMynd Services. For more information on payment methods, charges and fees, the User shall refer to the Payment section on the platform. HappiMynd reserves the right to change any or all parts of the Payment policy without notice or liability to the user or any third party. All cancellations and refunds will be handled as per the Cancellation & Refund Policy of the Company. HappiMynd reserves the right to change any or all parts of the Cancellation & Refund Policy without notice or liability to the user or any third party.
Payment -
All applicable payments should be made prior to availing HappiMynd services. The user's session booking(s) will not be confirmed till the payment is received by HappiMynd. If you are accessing our services through your organisation, beyond any sessions that might be offered to you as part of HappiMynd's association with your organisation, the user's session booking(s) will not be confirmed till the payment is received by HappiMynd.

Fee Information - 
For individual users, the fee per session is dependent on the selected psychological wellness expert. For users who are accessing sessions through their organisation, the fee per session depends on the selected psychological wellness expert and specific arrangements with their organisation beyond their included sessions.

Cancellation, Reschedule and Refund Policy -
To maximize user satisfaction, HappiMynd strives to provide the best possible service. The user has the flexibility to
1.Reschedule the session
2.Cancel the session
3.Claim a refund on the cancelled session

Cancellation By The User -
The user can cancel the session and claim a refund in one of the two means offered:
1.Session Refund
2.Money Refund, in case the user has made a payment for the session
    
If the session is cancelled at least 24 hours in advance of the scheduled session then the user can claim a 100% session refund or, if applicable, a 100% money refund. If it is cancelled after that then no session/money refund would be provided.

For sessions cancelled at least 24 hours in advance, at the time of cancellation, the user has three options:

1.Book a new session at the time of the cancellation with the same expert;
2.Take a session credit on the user's account on the HappiMynd platform. This session credit can be used within the validity period of 15 days to book a session with the same expert;
3.Take a refund back to the user's original method of payment, in cases where the user has made a payment for the session, by writing to support@happimynd.com.

All money refunds will be processed within 14 days. Please note that, depending on the bank, it might take longer for the amount to get credited to your account.

Reschedule/ Cancellation by HappiMynd Expert - 
If the session is rescheduled/cancelled by the HappiMynd expert, the user will receive a session/money credit on their account on the HappiMynd platform, regardless of the time at which the cancellation was done. This credit can be used within the validity period of 15 days to:
Book a session with the same expert within the validity period. Claim money refund for this session credit within the validity period, if the user made a payment to book the session.

The User will need to write to us at support@happimynd.com within the validity period; in which case, the entire consultation amount as mentioned on the Website will be refunded to the User within the next 14 business days in the original mode of payment done by the User while booking. Beyond said period, a refund will not be offered. Please note that, depending on the bank, it might take longer for the amount to get credited to your account.

Session Delayed/Technical Issues - 
If due to an unforeseeable reason from HappiMynd's end, a booked session is not completed in its entirety by the HappiMynd expert, the user may write to support@happimynd.com. Refunds will be handled on a case-to-case basis.

If you have any other queries or grievances related to refund, cancellation or reschedule please write to us at support@happimynd.com.
    `,
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
      "HappiMynd does not guarantee that you will be accepted as a registered user at HappiMynd, or as a client by the Psychological Wellness Professionals on our platform. HappiMynd reserves the right to terminate your registration with our platform at any time without citing a reason. HappiMynd is a technology enabler that connects the user and the Psychological Wellness Professional. Further, the professional Service is dependent on the information provided by the user to the Psychological Wellness Professional and HappiMynd does not promise any outcomes based on counselling and therapy. HappiMynd does not guarantee the availability of the same Psychological Wellness Professional over any period of time. From the moment at which you book your appointment, HappiMynd acts solely as an intermediary between you and the Wellness Professional, transmitting the details of your booking to you and to the Wellness Professional. Counselling will take place at a frequency agreed between you and your Psychological Wellness Professional. We cannot guarantee that sessions will always take place with a particular frequency or on the same day of the week but will make every effort to meet your requirements. Over the course of your agreement, the Wellness Professional might determine that online counselling Services are not appropriate for some or all of your treatment needs and accordingly may elect to not provide online counselling Services to you. Similarly, the Wellness Professional shall be at the liberty to decide that additional help is needed for the user and shall choose to bring in an additional Wellness Professional. HappiMynd makes all efforts to verify the credentials of every Psychological Wellness Professional registered with it. However, HappiMynd is not responsible for any misrepresentation/fraudulent credentials or claims by the Psychological Wellness Professionals. HappiMynd provides a profile page to all Psychological Wellness Professionals where information regarding education, training, experience, specialties can be provided to the user. It is the responsibility of the Psychological Wellness Professional to ensure the accuracy and reliability of such information provided. Most Psychological Wellness Professionals have a contractual relationship with HappiMynd and are allowed to use our platform and technology to provide Services to you. HappiMynd does not assume any responsibility for their actions, advice or any other information provided through our platform or otherwise. HappiMynd shall not be held liable for any damage/ loss/ liability caused to the user by a Psychological Wellness Professional, either directly or indirectly. The user is responsible for all their decisions and actions and agrees that they are made independent of any representations by HappiMynd or the Psychological Wellness Professionals. HappiMynd or the Wellness Professional cannot be held responsible for such decisions and actions or any outcomes as a result. HappiMynd does not endorse or influence control over any particular branch of medicine, theory, opinion, viewpoint or position on any topic. No warranty, guarantee, or conditions of any kind are created or offered on information or advice or suggestion, whether expressed and/ or implied, in oral and/ or written via any communication medium, obtained by you from HappiMynd or through any Service and/ or resource and/ or information that HappiMynd provides, except for those expressly outlined in this User Agreement. The Services, including content, on both the HappiMynd platform and third-party platforms, are provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or timelier sources of information. We are not responsible if information made available on the HappiMynd and third-party platforms is not accurate, complete or current and any reliance on the Services, including content, on the HappiMynd and third-party platforms is at your own risk. This platform may contain certain historical information. Historical information, necessarily, is not current and is provided for your reference only. We reserve the right to modify the contents of this platform at any time, but we have no obligation to update any information on our platform. You agree that it is your responsibility to monitor changes to our platform. The content that the user downloads or otherwise obtains through the use of our Services and/ or resources and/ or information is done at their own discretion and risk, and the user is solely responsible for any damage to their computer or other devices for any loss of data or information that may result from the download of such content. We reserve the right to modify or terminate any portion of the platform or the Services offered by the Company for any reason, without notice and without liability to the user or any third-party. The Company does not warrant that the functions contained in content, information and materials on the platform and / or Services, including, without limitation any third-party sites or Services linked to the platform and / or Services will be uninterrupted, timely or error-free, that the defects will be rectified, or that the platform or the servers that make such content, information and materials available are free of viruses or other harmful components. We will endeavour to make sure all information is delivered in an accurate and correct manner. However, any material downloaded or otherwise obtained through the platform and / or Services are accessed at your own risk, and you will be solely responsible for any damage or loss of data that results from such download to your computer system. At HappiMynd, we believe it is unethical for our counsellors to have dual relationships with current or former clients. During and after our counselling work, you are forbidden to have any individual relationship of any other type with our counsellors; this includes association on social and professional network websites such as Facebook, LinkedIn, Twitter etc. This will ensure that our professional relationship remains clear should you ever want to resume counselling or refer others to us. You hereby indemnify, defend, and hold the Company, the Company’s distributors, agents, representatives and other authorized users, and each of the foregoing entities’ respective resellers, distributors, Service providers and suppliers, and all of the foregoing entities’ respective officers, directors, owners, employees, agents, and representatives, harmless from and against any and all losses, damages, liabilities and costs arising from your use of the platform.",
  },
  {
    id: 11,
    title: "Disclaimer on Warranties",
    description:
      "You understand and agree that any interactions and associated issues with the Wellness Professional on the platform, is strictly between you and the Wellness Professional. You shall not hold HappiMynd and/ or the Wellness Professional responsible for any such interactions and associated issues. HappiMynd and/ or the Wellness Professional is not responsible for any outcome between you and the Wellness Professional you interact with. If you decide to engage with a Wellness Professional to provide Psychological wellness Services to you, you do so at your own discretion and risk. The Services and content, and all materials, information, products and Services included therein, are provided on an “as is” and “as available” basis without warranties of any kind. HappiMynd and its licensors and affiliates expressly disclaim all warranties of any kind, express, implied, or statutory, relating to the Services and content. In addition, HappiMynd and its licensors and affiliates disclaim any warranties regarding security, accuracy, reliability, timeliness and performance of the Services or that the Services will be error-free or that any errors will be corrected. No advice or information provided to you by breakthrough will create any warranty that is not expressly stated in these Terms of Service. We make no representations concerning, and do not guarantee, the accuracy of the Services, including, but not limited to, any information provided through the Services or their applicability to your individual circumstances. We may provide you with access to third-party tools which we neither monitor nor have any control or input over. Such tools may be in the form of, but not limited to, personal assessments, polls and their results etc. You acknowledge and agree that we provide access to such tools on an “as is” and “as available” basis without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools. Any use by you of optional tools offered through the platform is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).Third-party links on this platform may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or Services of third-parties. Over the course of the period of the User Agreement, we might incorporate products/ Services from third-party providers on our platform. By using such products/ Services, it is understood that the user has read, understood and agreed to the terms and conditions of the corresponding third-party provider. HappiMynd shall not be held liable for any risk/ damage/ liability arising from use of such third-party products, Services goods, resources, content, or any other transactions made in connection with any third-party websites. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.",
  },
  {
    id: 12,
    title:
      "User Forums, Topics, Replies, Comments, Feedback and Other Submissions",
    description:
      "If, at our request, you send certain specific submissions (for example contest entries) or without a request from us you send or submit forum topics, replies, comments, creative ideas, suggestions, proposals, plans, or other materials, whether online, by email, by postal mail, on our social media channels, or otherwise (collectively, “comments”), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are and shall be under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments. HappiMynd however guarantees that all communication between the user and HappiMynd and / or the counsellor within the ambit of therapy shall be kept confidential, subject to compliance with applicable laws. You agree to not seek other any other person’s contact information through our platform. You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You further agree that your comments will not contain libellous or otherwise unlawful, abusive or obscene material, or contain any computer virus or other malware that could in any way affect the operation of the Service or any related website or application. You may not use a false e-mail address, pretend to be someone other than yourself, or otherwise mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party. We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion as unlawful, offensive, threatening, libellous, defamatory, pornographic, obscene or otherwise objectionable or in violation of any party’s intellectual property or these Terms of Service. Users must note that HappiMynd is an interactive Service and other users are free to post their own comments on various content of the platform. The platform publishes articles provided by various authors as well. The contents/viewpoints expressed in these comments/posts/articles etc. are their authors’. Such content does not indicate official position of HappiMynd, in any way, express or implied.",
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
      "The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes. This User Agreement is effective unless and until terminated by either you or us. You may terminate this User Agreement at any time by notifying us - directly, or if you are accessing the platform through a third-party, then through the respective third-party - that you no longer wish to use HappiMynd’s Services, or when you cease using our platform, subject to settlement of all outstanding payments. If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of this User Agreement, we also may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination; and/or accordingly we may deny you access to our Services (or any part thereof).",
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
      "The following provisions set out our entire liability and your attention is in particular drawn to the provisions of this clause. We do not guarantee, represent or warrant that your use of our Service will be uninterrupted, timely, secure or error-free. You agree to indemnify HappiMynd against any breach in confidentiality. If you access HappiMynd through a third-party platform, you agree that HappiMynd cannot be responsible for any data breaches that occur due to any acts of commission or omission from the third-party platform. We do not warrant that the results that may be obtained from the use of the Service will be accurate or reliable. You agree that from time to time we may remove the Service (or part thereof) for indefinite periods of time or cancel the Service at any time, without notice to you. You agree that we may we can introduce promotional offers (including discounts & free offerings) as per need & at our will and as a paying customers you cannot raise a claim against the same. You expressly agree that your use of, or inability to use, the Service is at your sole risk. The Service and all products and Services delivered to you through the Service are (except as expressly stated by us) provided ‘as is’ and ‘as available’ for your use, and/or in keeping with HappiMynd’s arrangement with your organisation, without any representation, warranties or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement. In no case shall HappiMynd, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, Service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the Services or any products procured using the Services, or for any other claim related in any way to your use of the Services or any product, including, but not limited to, any errors or omissions in any content, or any loss or damage of any kind incurred as a result of the use of the Services or any content (or product) posted, transmitted, or otherwise made available via the Service or platform, even if advised of their possibility. In all cases, our maximum liability shall be limited to the amount paid by you, if at all, for Service/product in dispute.",
  },
  {
    id: 18,
    title: "Indemnification",
    description:
      "You agree to indemnify, defend and hold harmless HappiMynd and our subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, Service providers, subcontractors, suppliers, employees and interns, harmless against any claim or demand, including reasonable attorneys’ fees, made by any third-party due to or arising out of your breach of this User Agreement or the documents they incorporate by reference, or your violation of any law or the rights of a third-party. You agree to indemnify HappiMynd for any breach in confidentiality. If you access HappiMynd through a third-party platform, you indemnify HappiMynd against any data breaches that occur due to any acts of commission or omission from the third-party platform.",
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
      "Survival: In the event of termination or expiration of these Terms for any reason, any provisions of these Terms that by their nature should survive termination of these Terms will survive termination of these Terms, unless contrary to the pertinent provisions herein stated. Severability: In the event that any provision of this User Agreement is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service; such determination shall not affect the validity and enforceability of any other remaining provisions. Unenforceability: If any provision of these Terms or any word, phrase, clause, sentence, or other portion thereof should be held to be unenforceable or invalid for any reason, then provided that the essential consideration for entering into these Terms on the part of any Party is not unreasonably impaired, such provision or portion thereof shall be modified or deleted in such manner as to render these Terms as modified legal and enforceable to the maximum extent permitted under applicable laws. No Waiver: No delay or omission by either Party hereto to exercise any right or power occurring upon any noncompliance or default by the other party with respect to any of the terms of these Terms shall impair any such right or power or be construed to be a waiver thereof. The terms and conditions of these Terms may be waived or amended only in writing or mutual agreement of the Parties. A waiver by either of the Parties hereto of any of the covenants, conditions, or agreements to be performed by the other shall not be construed to be a waiver of any succeeding breach thereof or of any covenant, condition, or agreement herein contained (whether or not the provision is similar).Notices: Any notice required or permitted to be given to HappiMynd hereunder shall be in writing and sent or transmitted by (i) registered or certified mail; (ii) hand-delivery; (iii) email; or (iv) internationally recognized courier service, provided its receipt is acknowledged and, dispatched or sent or transmitted to the address specified HappiMynd. All notice required to be given under these Terms shall be addressed to: Name: HappiMynd Professional Services Pvt. Ltd., \n Postal Address: \nSec-49, Vatika City, Gurugram -122018, \nE-mail Address: ravikant@happimynd.com; \nContact Information-Registered Address: \nSec-49, Vatika City, Gurugram -122018; \nE-mail id: support@happimynd.com",
  },
];

const PolicyContent = (props) => {
  //Prop Destructuring
  const { title, description } = props;

  return (
    <View>
      <Text style={styles.PolicyTitle}>{title}</Text>

      {/* Sized Box */}
      <View style={{ height: hp(1) }} />

      <Text style={styles.PolicyDescription}>{description}</Text>
    </View>
  );
};

const Terms = (props) => {
  // Prop Destructuring
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <ScrollView
        style={{ paddingHorizontal: wp(6) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Sized Box */}
        <View style={{ height: hp(3) }} />

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Terms Of Engagement</Text>
        </View>

        {/* Sized Box */}
        <View style={{ height: hp(4) }} />

        {/* Body Section */}
        <View>
          {policyContentData.map((data) => (
            <View key={data.id}>
              <PolicyContent
                title={data.title}
                description={data.description}
              />
              {/* Sized Box */}
              <View style={{ height: hp(4) }} />
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
  titleSection: {
    // backgroundColor: "red",
  },
  title: {
    fontSize: RFValue(26),
    fontFamily: "PoppinsSemiBold",
    color: colors.pageTitle,
  },
  PolicyTitle: {
    fontSize: RFValue(22),
    fontFamily: "PoppinsMedium",
  },
  PolicyDescription: {
    fontSize: RFValue(12),
    fontFamily: "Poppins",
    color: colors.borderDark,
    lineHeight: hp(3),
    textAlign: "justify",
  },
});

export default Terms;
