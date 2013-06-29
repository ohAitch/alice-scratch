#include <cstdio>
#include <map>
#include <string>
#include <vector>
#include <stdexcept>

#include "llvm/Analysis/Passes.h"
#include "llvm/Analysis/Verifier.h"
//#include "llvm/ExecutionEngine/ExecutionEngine.h"
#include "llvm/ExecutionEngine/JIT.h"
//#include "llvm/DataLayout.h"
//#include "llvm/DerivedTypes.h"
#include "llvm/IRBuilder.h"
//#include "llvm/LLVMContext.h"
#include "llvm/Module.h"
#include "llvm/Support/TargetSelect.h"
#include "llvm/Transforms/Scalar.h"
#include "llvm/PassManager.h"

using namespace std;

//===--------------------------------------------===// utils //===--------------------------------------------===//

exception err(const string& v) {return runtime_error(v);}

//===--------------------------------------------===// llvm utils //===--------------------------------------------===//

llvm::ExecutionEngine* llvm_build_engine(llvm::Module* module) {
	string t; llvm::ExecutionEngine* r = llvm::EngineBuilder(module).setErrorStr(&t).create(); if (!r) throw err(t); return r;}
// create an alloca instruction in the entry block of the function . this is used for mutable variables etc.
llvm::AllocaInst* create_entry_block_alloca(llvm::Function* f, const string &var_name) {
	llvm::IRBuilder<> t(&f->getEntryBlock(), f->getEntryBlock().begin());
	return t.CreateAlloca(llvm::Type::getDoubleTy(llvm::getGlobalContext()), 0, var_name.c_str());}

//===--------------------------------------------===// <edge> //===--------------------------------------------===//

// http://llvm.org/docs/LangRef.html

llvm::Module* module;
llvm::IRBuilder<> Builder(llvm::getGlobalContext());
llvm::FunctionPassManager* fpm;

double printd(double v) {printf("%f\n", v); return v;}

int main() {
	llvm::InitializeNativeTarget();
	// Make the module, which holds all the code.
	module = new llvm::Module("module of primacy",llvm::getGlobalContext());
	// Create the JIT.  This takes ownership of the module.
	llvm::ExecutionEngine* engine = llvm_build_engine(module);
	// fpm !
	llvm::FunctionPassManager t(module);
	t.add(new llvm::DataLayout(*engine->getDataLayout())); // Set up the optimizer pipeline.  Start with registering info about how the target lays out t.ructures.
	t.add(llvm::createBasicAliasAnalysisPass()); // Provide basic AliasAnalysis support for GVN.
	t.add(llvm::createPromoteMemoryToRegisterPass()); // Promote allocas to registers.
	t.add(llvm::createInstructionCombiningPass()); // Do simple "peephole" optimizations and bit-twiddling optzns.
	t.add(llvm::createReassociatePass()); // Reassociate expressions.
	t.add(llvm::createGVNPass()); // Eliminate Common SubExpressions.
	t.add(llvm::createCFGSimplificationPass()); // Simplify the control flow graph (deleting unreachable blocks, etc).
	t.doInitialization();
	fpm = &t;

	{ // q = fn(a,b) a+b
		vector<string> args; args.push_back("a"); args.push_back("b");
		// Make the function type:  double(double,double) etc.
		vector<llvm::Type*> doubles(args.size(), llvm::Type::getDoubleTy(llvm::getGlobalContext()));
		llvm::FunctionType* ftype = llvm::FunctionType::get(llvm::Type::getDoubleTy(llvm::getGlobalContext()), doubles, false);
		llvm::Function* f = llvm::Function::Create(ftype, llvm::Function::ExternalLinkage, "q", module);
		// Set names for all arguments.
		{unsigned i = 0;
		for (llvm::Function::arg_iterator v = f->arg_begin(); i != args.size(); ++v, ++i)
			v->setName(args[i]);}
		// Create a new basic block to start insertion into.
		llvm::BasicBlock* block = llvm::BasicBlock::Create(llvm::getGlobalContext(), "entry", f);
		Builder.SetInsertPoint(block);
		// Add all arguments to the symbol table and create their allocas.
		//proto->CreateArgumentAllocas(f);
		/// CreateArgumentAllocas - Create an alloca for each argument and register the argument in the symbol table so that references to it will succeed.
		//void PrototypeAST::CreateArgumentAllocas(llvm::Function* F) {
			llvm::Function::arg_iterator iter = f->arg_begin();
			llvm::AllocaInst* alloca_a = create_entry_block_alloca(f, args[0]);
			llvm::AllocaInst* alloca_b = create_entry_block_alloca(f, args[1]);
			Builder.CreateStore(iter, alloca_a); ++iter;
			Builder.CreateStore(iter, alloca_b);
			//llvm::Function::arg_iterator iter = f->arg_begin();
			//for (unsigned i = 0, e = args.size(); i != e; ++i, ++iter) {
			//	// Create an alloca for this variable.
			//	llvm::AllocaInst* alloca = create_entry_block_alloca(f, args[i]);
			//	// Store the initial value into the alloca.
			//	Builder.CreateStore(iter, alloca);
			//	// Add arguments to variable symbol table.
			//	//NamedValues[args[i]] = alloca;
			//}
		//llvm::Value* ret_val = body->emit();
		llvm::Value* ret_val; {
			llvm::Value* l = Builder.CreateLoad(alloca_a, "a");
			llvm::Value* r = Builder.CreateLoad(alloca_b, "b");
			ret_val = Builder.CreateFAdd(l, r, "addtmp");}
		// Finish off the function.
		Builder.CreateRet(ret_val);
		// Validate the generated code, checking for consistency.
		llvm::verifyFunction(*f);
		// Optimize the function.
		fpm->run(*f);
	}
	{ // print = builtin("printd")
		vector<llvm::Type*> doubles(1,llvm::Type::getDoubleTy(llvm::getGlobalContext()));
		llvm::FunctionType* ftype = llvm::FunctionType::get(llvm::Type::getDoubleTy(llvm::getGlobalContext()), doubles, false);
		llvm::Function *f = llvm::Function::Create(ftype, llvm::Function::ExternalLinkage, "print", module);
		engine->updateGlobalMapping(f,(void*)printd);
	}
	{ // print(q(1,2.4))
		vector<string> args;
		// Make the function type:  double(double,double) etc.
		vector<llvm::Type*> doubles;
		llvm::FunctionType* ftype = llvm::FunctionType::get(llvm::Type::getDoubleTy(llvm::getGlobalContext()), doubles, false);
		llvm::Function* f = llvm::Function::Create(ftype, llvm::Function::ExternalLinkage, "", module);
		// Set names for all arguments.
		// noop!
		// Create a new basic block to start insertion into.
		llvm::BasicBlock* block = llvm::BasicBlock::Create(llvm::getGlobalContext(), "entry", f);
		Builder.SetInsertPoint(block);
		// Add all arguments to the symbol table and create their allocas.
		//proto->CreateArgumentAllocas(f);
		/// CreateArgumentAllocas - Create an alloca for each argument and register the argument in the symbol table so that references to it will succeed.
		//void PrototypeAST::CreateArgumentAllocas(llvm::Function* F) {
		//	llvm::Function::arg_iterator iter = f->arg_begin();
		//	for (unsigned i = 0, e = args.size(); i != e; ++i, ++iter) {
		//		// Create an alloca for this variable.
		//		llvm::AllocaInst* alloca = create_entry_block_alloca(f, args[i]);
		//		// Store the initial value into the alloca.
		//		Builder.CreateStore(iter, alloca);
		//		// Add arguments to variable symbol table.
		//		//NamedValues[args[i]] = alloca;
		//	}
		// ??
		llvm::Value* qval; {
			llvm::Function* f = module->getFunction("q");
			vector<llvm::Value*> args;
			args.push_back(llvm::ConstantFP::get(llvm::getGlobalContext(), llvm::APFloat(1.0)));
			args.push_back(llvm::ConstantFP::get(llvm::getGlobalContext(), llvm::APFloat(2.4)));
			qval = Builder.CreateCall(f,args,"calltmp");}
		llvm::Value* printval; {
			llvm::Function* f = module->getFunction("print");
			vector<llvm::Value*> args; args.push_back(qval);
			printval = Builder.CreateCall(f,args,"calltmp");}
		//llvm::Value* ret_val = body->emit();
		//llvm::Value* ret_val = llvm::ConstantFP::get(llvm::getGlobalContext(), llvm::APFloat(1.0));
		llvm::Value* ret_val = printval;
		// Finish off the function.
		Builder.CreateRet(ret_val);
		// Validate the generated code, checking for consistency.
		llvm::verifyFunction(*f);
		// Optimize the function.
		fpm->run(*f);

		// JIT the function, returning a function pointer.
		void* fcv = engine->getPointerToFunction(f);
		// Cast it to the right type (takes no arguments, returns a double) so we can call it as a native function.
		double (*fc)() = (double (*)())(intptr_t)fcv;
		printf("Evaluated to %f\n", fc());
	}

	printf("--------------\n");
	module->dump();
	return 0;}