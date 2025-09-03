import React from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

const faqs = [
  {
    question: "How do I access the facial recognition exam system?",
    answer:
      "Students must first be registered by the teacher. Once registered, the student can log in using their assigned credentials and proceed to the exam page."
  },
  {
    question: "What do I need before taking an exam with facial recognition?",
    answer:
      "Make sure your webcam is working properly, you have a stable internet connection, and you are in a well-lit room with no one else around."
  },
  {
    question: "How does the facial recognition system verify my identity?",
    answer:
      "The system captures your facial features using the webcam and matches it against the data registered by your teacher to ensure you're the correct student."
  },
  {
    question: "What happens if I move too much or look away during the exam?",
    answer:
      "The system tracks your movements. If unusual behavior is detected (e.g., turning left, right, or looking down for a long time), it may alert the teacher or automatically end the exam."
  },
  {
    question: "Is my personal data safe when using facial recognition?",
    answer:
      "Yes. The system complies with the Data Privacy Act (RA 10173). Your facial data is encrypted and used only for verification during the exam."
  },
  {
    question: "What should I do if there's a technical issue during the exam?",
    answer:
      "Immediately inform your teacher or the technical support team. Do not attempt to refresh the page or restart the exam without permission."
  },
  {
    question: "Can I take the exam on any device?",
    answer:
      "You should use a laptop or desktop with a functional webcam. Mobile devices may not fully support facial recognition or exam monitoring features."
  }
];

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto p-6 sans-serif">
      <h1 className="text-3xl font-bold mb-4 text-center">FAQs - Facial Recognition Year-Level Exam System</h1>
      <div className="border-t border-blue-200 mb-6" />
      <Card className="w-full">
        <CardContent className="p-4">
          <Accordion type="single" collapsible className="w-full ">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium ">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-white text-lg whitespace-pre-line text-black dark:text-white">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}


