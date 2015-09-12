package zutil;

import com.bulletphysics.BulletGlobals;
import com.bulletphysics.BulletStats;
import com.bulletphysics.collision.broadphase.BroadphaseInterface;
import com.bulletphysics.collision.broadphase.BroadphaseNativeType;
import com.bulletphysics.collision.broadphase.DbvtBroadphase;
import com.bulletphysics.collision.dispatch.CollisionDispatcher;
import com.bulletphysics.collision.dispatch.CollisionObject;
import com.bulletphysics.collision.dispatch.CollisionWorld;
import com.bulletphysics.collision.dispatch.DefaultCollisionConfiguration;
import com.bulletphysics.collision.shapes.BoxShape;
import com.bulletphysics.collision.shapes.BvhTriangleMeshShape;
import com.bulletphysics.collision.shapes.CollisionShape;
import com.bulletphysics.collision.shapes.CompoundShape;
import com.bulletphysics.collision.shapes.ConcaveShape;
import com.bulletphysics.collision.shapes.ConvexShape;
import com.bulletphysics.collision.shapes.CylinderShape;
import com.bulletphysics.collision.shapes.CylinderShapeX;
import com.bulletphysics.collision.shapes.PolyhedralConvexShape;
import com.bulletphysics.collision.shapes.ShapeHull;
import com.bulletphysics.collision.shapes.SphereShape;
import com.bulletphysics.collision.shapes.StaticPlaneShape;
import com.bulletphysics.collision.shapes.TriangleIndexVertexArray;
import com.bulletphysics.dynamics.DiscreteDynamicsWorld;
import com.bulletphysics.dynamics.DynamicsWorld;
import com.bulletphysics.dynamics.RigidBody;
import com.bulletphysics.dynamics.RigidBodyConstructionInfo;
import com.bulletphysics.dynamics.constraintsolver.ConstraintSolver;
import com.bulletphysics.dynamics.constraintsolver.HingeConstraint;
import com.bulletphysics.dynamics.constraintsolver.Point2PointConstraint;
import com.bulletphysics.dynamics.constraintsolver.SequentialImpulseConstraintSolver;
import com.bulletphysics.dynamics.constraintsolver.SliderConstraint;
import com.bulletphysics.dynamics.constraintsolver.TypedConstraint;
import com.bulletphysics.dynamics.vehicle.DefaultVehicleRaycaster;
import com.bulletphysics.dynamics.vehicle.RaycastVehicle;
import com.bulletphysics.dynamics.vehicle.VehicleRaycaster;
import com.bulletphysics.dynamics.vehicle.VehicleTuning;
import com.bulletphysics.dynamics.vehicle.WheelInfo;
import com.bulletphysics.linearmath.Clock;
import com.bulletphysics.linearmath.DefaultMotionState;
import com.bulletphysics.linearmath.MatrixUtil;
import com.bulletphysics.linearmath.QuaternionUtil;
import com.bulletphysics.linearmath.Transform;
import com.bulletphysics.linearmath.TransformUtil;
import com.bulletphysics.linearmath.VectorUtil;
import com.bulletphysics.util.IntArrayList;
import com.bulletphysics.util.ObjectArrayList;
import com.bulletphysics.util.ObjectPool;
import java.awt.event.KeyEvent;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import javax.vecmath.Color3f;
import javax.vecmath.Matrix3f;
import javax.vecmath.Quat4f;
import javax.vecmath.Vector3f;
import org.lwjgl.LWJGLException;
import org.lwjgl.input.Keyboard;
import org.lwjgl.input.Mouse;
import org.lwjgl.opengl.Display;
import static org.lwjgl.opengl.GL11.*;
import static org.lwjgl.util.glu.GLU.*;

public class Bullet {

static public final float TAU = (float)(Math.PI*2);
static public final float STEPSIZE = 5;
static public final float CUBE_HALF_EXTENTS = 1f;
static public final int maxNumObjects = 16384;
static public final float LIFT_EPS = 0.0000001f;
static public final float mousePickClamping = 3f;
//static public final BulletStack stack = BulletStack.get();
static public RigidBody pickedBody = null; // for deactivation state
static public Clock clock = new Clock();
static public DynamicsWorld dynamicsWorld = null;
static public TypedConstraint pickConstraint = null; // constraint for mouse picking
static public float cameraDistance = 26;
static public final Vector3f camPos = new Vector3f(30f, 30f, 30f);
static public final Vector3f camTargetPos = new Vector3f(0f, 0f, 0f); // look at
static public int glutScreenWidth = 0;
static public int glutScreenHeight = 0;
static public float boxShootSpeed = 40f;

static public void shootBox(Vector3f dest) {
	RigidBody body = localCreateRigidBody(1, trAt(camPos), new BoxShape(new Vector3f(1f, 1f, 1f)));

	Vector3f linVel = new Vector3f(dest.x - camPos.x, dest.y - camPos.y, dest.z - camPos.z);
	linVel.normalize();
	linVel.scale(boxShootSpeed);

	Transform worldTrans = body.getWorldTransform(new Transform());
	worldTrans.origin.set(camPos);
	worldTrans.setRotation(new Quat4f(0f, 0f, 0f, 1f));
	body.setWorldTransform(worldTrans);
	
	body.setLinearVelocity(linVel);
	body.setAngularVelocity(new Vector3f(0f, 0f, 0f));

	body.setCcdMotionThreshold(1f);
	body.setCcdSweptSphereRadius(0.2f);
}
static public Vector3f getRayTo(int x, int y) {
	float top = 1f;
	float bottom = -1f;
	float nearPlane = 1f;
	float tanFov = (top - bottom) * 0.5f / nearPlane;
	float fov = 2f * (float) Math.atan(tanFov);

	Vector3f rayFrom = new Vector3f(camPos);
	Vector3f rayForward = new Vector3f();
	rayForward.sub(camTargetPos, camPos);
	rayForward.normalize();
	float farPlane = 10000f;
	rayForward.scale(farPlane);

	Vector3f rightOffset = new Vector3f();
	Vector3f vertical = new Vector3f(0,1,0);

	Vector3f hor = new Vector3f();
	// TODO: check: hor = rayForward.cross(vertical);
	hor.cross(rayForward, vertical);
	hor.normalize();
	// TODO: check: vertical = hor.cross(rayForward);
	vertical.cross(hor, rayForward);
	vertical.normalize();

	float tanfov = (float) Math.tan(0.5f * fov);
	
	float aspect = glutScreenHeight / (float)glutScreenWidth;
	
	hor.scale(2f * farPlane * tanfov);
	vertical.scale(2f * farPlane * tanfov);
	
	if (aspect < 1f) hor.scale(1f / aspect);
	else vertical.scale(aspect);
	
	Vector3f rayToCenter = new Vector3f();
	rayToCenter.add(rayFrom, rayForward);
	Vector3f dHor = new Vector3f(hor);
	dHor.scale(1f / (float) glutScreenWidth);
	Vector3f dVert = new Vector3f(vertical);
	dVert.scale(1.f / (float) glutScreenHeight);

	Vector3f tmp1 = new Vector3f();
	Vector3f tmp2 = new Vector3f();
	tmp1.scale(0.5f, hor);
	tmp2.scale(0.5f, vertical);

	Vector3f rayTo = new Vector3f();
	rayTo.sub(rayToCenter, tmp1);
	rayTo.add(tmp2);

	tmp1.scale(x, dHor);
	tmp2.scale(y, dVert);

	rayTo.add(tmp1);
	rayTo.sub(tmp2);
	return rayTo;
}
static public void mouseFunc(int button, int state, int x, int y) {
	//button 0, state 0 means left mouse down

	Vector3f rayTo = new Vector3f(getRayTo(x, y));

	switch (button) {
		case 2: {
			if (state == 0) {
				shootBox(rayTo);
			}
			break;
		}
		case 1: {
			if (state == 0) {
				// apply an impulse
				if (dynamicsWorld != null) {
					CollisionWorld.ClosestRayResultCallback rayCallback = new CollisionWorld.ClosestRayResultCallback(camPos, rayTo);
					dynamicsWorld.rayTest(camPos, rayTo, rayCallback);
					if (rayCallback.hasHit()) {
						RigidBody body = RigidBody.upcast(rayCallback.collisionObject);
						if (body != null) {
							body.setActivationState(CollisionObject.ACTIVE_TAG);
							Vector3f impulse = new Vector3f(rayTo);
							impulse.normalize();
							float impulseStrength = 10f;
							impulse.scale(impulseStrength);
							Vector3f relPos = new Vector3f();
							relPos.sub(rayCallback.hitPointWorld, body.getCenterOfMassPosition(new Vector3f()));
							body.applyImpulse(impulse, relPos);
						}
					}
				}
			}
			else {
			}
			break;
		}
		case 0: {
			if (state == 0) {
				// add a point to point constraint for picking
				if (dynamicsWorld != null) {
					CollisionWorld.ClosestRayResultCallback rayCallback = new CollisionWorld.ClosestRayResultCallback(camPos, rayTo);
					dynamicsWorld.rayTest(camPos, rayTo, rayCallback);
					if (rayCallback.hasHit()) {
						RigidBody body = RigidBody.upcast(rayCallback.collisionObject);
						if (body != null) {
							// other exclusions?
							if (!(body.isStaticObject() || body.isKinematicObject())) {
								pickedBody = body;
								pickedBody.setActivationState(CollisionObject.DISABLE_DEACTIVATION);

								Vector3f pickPos = new Vector3f(rayCallback.hitPointWorld);

								Transform tmpTrans = body.getCenterOfMassTransform(new Transform());
								tmpTrans.inverse();
								Vector3f localPivot = new Vector3f(pickPos);
								tmpTrans.transform(localPivot);

								Point2PointConstraint p2p = new Point2PointConstraint(body, localPivot);
								p2p.setting.impulseClamp = mousePickClamping;

								dynamicsWorld.addConstraint(p2p);
								pickConstraint = p2p;
								// save mouse position for dragging
								BulletStats.gOldPickingPos.set(rayTo);
								Vector3f eyePos = new Vector3f(camPos);
								Vector3f tmp = new Vector3f();
								tmp.sub(pickPos, eyePos);
								BulletStats.gOldPickingDist = tmp.length();
								// very weak constraint for picking
								p2p.setting.tau = 0.1f;
							}
						}
					}
				}

			}
			else {

				if (pickConstraint != null && dynamicsWorld != null) {
					dynamicsWorld.removeConstraint(pickConstraint);
					// delete m_pickConstraint;
					//printf("removed constraint %i",gPickingConstraintId);
					pickConstraint = null;
					pickedBody.forceActivationState(CollisionObject.ACTIVE_TAG);
					pickedBody.setDeactivationTime(0f);
					pickedBody = null;
				}
			}
			break;
		}
		default: {
		}
	}
}
static public void mouseMotionFunc(int x, int y) {
	// move the constraint pivot
	Point2PointConstraint p2p = (Point2PointConstraint)pickConstraint;
	if (p2p != null) {
		// keep it at the same picking distance

		Vector3f newRayTo = new Vector3f(getRayTo(x, y));
		Vector3f eyePos = new Vector3f(camPos);
		Vector3f dir = new Vector3f();
		dir.sub(newRayTo, eyePos);
		dir.normalize();
		dir.scale(BulletStats.gOldPickingDist);

		Vector3f newPos = new Vector3f();
		newPos.add(eyePos, dir);
		p2p.setPivotB(newPos);
	}
}
static public RigidBody createRigidBody(float mass, Transform startTransform, Transform centerOfMassOffset, CollisionShape shape) {
	// rigidbody is dynamic if and only if mass is non zero, otherwise static
	boolean isDynamic = (mass != 0f);
	Vector3f localInertia = new Vector3f(0f, 0f, 0f);
	if (isDynamic)
		shape.calculateLocalInertia(mass, localInertia);
	// using motionstate is recommended, it provides interpolation capabilities, and only synchronizes 'active' objects
	DefaultMotionState myMotionState =
		centerOfMassOffset == null?
			new DefaultMotionState(startTransform) :
			new DefaultMotionState(startTransform, centerOfMassOffset);
	RigidBodyConstructionInfo cInfo = new RigidBodyConstructionInfo(mass, myMotionState, shape, localInertia);
	RigidBody body = new RigidBody(cInfo);
	//body.setActivationState(RigidBody.ISLAND_SLEEPING);
	return body;
}
static public RigidBody localCreateRigidBody(float mass, Transform startTransform, CollisionShape shape) {
	return localCreateRigidBody(mass, startTransform, null, shape);}
static public RigidBody localCreateRigidBody(float mass, Transform startTransform, Transform centerOfMassOffset, CollisionShape shape) {
	RigidBody t = createRigidBody(mass, startTransform, centerOfMassOffset, shape);
	dynamicsWorld.addRigidBody(t);
	return t;
}
// See http://www.lighthouse3d.com/opengl/glut/index.php?bmpfontortho
static public void setOrthographicProjection() {
	// switch to projection mode
	glMatrixMode(GL_PROJECTION);
	
	// save previous matrix which contains the 
	//settings for the perspective projection
	glPushMatrix();
	// reset matrix
	glLoadIdentity();
	// set a 2D orthographic projection
	gluOrtho2D(0f, glutScreenWidth, 0f, glutScreenHeight);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	
	// invert the y axis, down is positive
	glScalef(1f, -1f, 1f);
	// mover the origin from the bottom left corner
	// to the upper left corner
	glTranslatef(0f, -glutScreenHeight, 0f);
}
static public void resetPerspectiveProjection() {
	glMatrixMode(GL_PROJECTION);
	glPopMatrix();
	glMatrixMode(GL_MODELVIEW);
	updateCamera();
}
static public void super_renderme() {
	updateCamera();

	if (dynamicsWorld != null) {
		int numObjects = dynamicsWorld.getNumCollisionObjects();
		for (int i = 0; i < numObjects; i++) {
			CollisionObject colObj = dynamicsWorld.getCollisionObjectArray().getQuick(i);
			RigidBody body = RigidBody.upcast(colObj);

			Transform m = new Transform();
			if (body != null && body.getMotionState() != null)
				m.set(((DefaultMotionState)body.getMotionState()).graphicsWorldTrans);
			else
				colObj.getWorldTransform(m);

			Vector3f wireColor = ((i & 1) != 0)? new Vector3f(1f, 1f, 0.5f) : new Vector3f(0f, 0f, 1f); // wants deactivation

			// color differently for active, sleeping, wantsdeactivation states
			if (colObj.getActivationState() == 1) { // active
				if ((i & 1) != 0)
					wireColor.add(new Vector3f(1f, 0f, 0f));
				else
					wireColor.add(new Vector3f(0.5f, 0f, 0f));
			}
			if (colObj.getActivationState() == 2) {// ISLAND_SLEEPING
				if ((i & 1) != 0)
					wireColor.add(new Vector3f(0f, 1f, 0f));
				else
					wireColor.add(new Vector3f(0f, 0.5f, 0f));
			}

			drawOpenGL(m, colObj.getCollisionShape(), wireColor);
		}
	}
	
	updateCamera();
}
static public float getDeltaTimeMicroseconds() {
	float r = clock.getTimeMicroseconds();
	clock.reset();
	return r;
}
//}
//============================================================// from ForkLiftDemo //============================================================//
//{
static int rightIndex = 0;
static int upIndex = 1;
static int forwardIndex = 2;

// RaycastVehicle is the interface for the constraint that implements the raycast vehicle
// notice that for higher-quality slow-moving vehicles, another approach might be better
// implementing explicit hinged-wheel constraints with cylinder collision, rather then raycasts
static float gEngineForce = 0.f;

static float gVehicleSteering = 0.f;
static float steeringIncrement = 0.04f;
static float steeringClamp = 0.3f;
static float wheelRadius = 0.5f;
static float wheelWidth = 0.4f;

static float suspensionRestLength = 0.6f;

static public RigidBody carChassis;

static public RigidBody liftBody;
static public HingeConstraint liftHinge;

static public RigidBody forkBody;
static public SliderConstraint forkSlider;

// FOR NOW: imagine a dodecahedron with a face flat on the ground. 0 is the top face, 1-5 are the next five faces, 6-10 are the next five, and 11 is the bottom face
// (also, each arm can dynamically alter its length)
static float p = (float)((1 + Math.sqrt(5)) / 2);
static public Vector3f[] icosohedronVerticies = {
	new Vector3f( 1, p, 0),
	new Vector3f(-1, p, 0),
	new Vector3f( 0, 1, p),
	new Vector3f( p, 0, 1),
	new Vector3f( p, 0,-1),
	new Vector3f( 0, 1,-p),
	new Vector3f(-p, 0,-1),
	new Vector3f(-p, 0, 1),
	new Vector3f( 0,-1, p),
	new Vector3f( 1,-p, 0),
	new Vector3f( 0,-1,-p),
	new Vector3f(-1,-p, 0)};
static public RigidBody[] l_arm = new RigidBody[12];
static public SliderConstraint[] l_armSlider = new SliderConstraint[12];

static public RaycastVehicle vehicle;

static public float cameraHeight = 4f;
static public float minCameraDistance = 3f;
static public float maxCameraDistance = 10f;

static public void lockLiftHinge() {
	float hingeAngle = liftHinge.getHingeAngle();
	float lowLim = liftHinge.getLowerLimit();
	float hiLim = liftHinge.getUpperLimit();
	liftHinge.enableAngularMotor(false, 0, 0);
	if (hingeAngle < lowLim)
		liftHinge.setLimit(lowLim, lowLim + LIFT_EPS);
	else if (hingeAngle > hiLim)
		liftHinge.setLimit(hiLim - LIFT_EPS, hiLim);
	else
		liftHinge.setLimit(hingeAngle - LIFT_EPS, hingeAngle + LIFT_EPS);
}
static public void lockForkSlider() {
	float linDepth = forkSlider.getLinearPos();
	float lowLim = forkSlider.getLowerLinLimit();
	float hiLim = forkSlider.getUpperLinLimit();
	forkSlider.setPoweredLinMotor(false);
	if (linDepth <= lowLim) {
		forkSlider.setLowerLinLimit(lowLim);
		forkSlider.setUpperLinLimit(lowLim);
	} else if (linDepth > hiLim) {
		forkSlider.setLowerLinLimit(hiLim);
		forkSlider.setUpperLinLimit(hiLim);
	} else {
		forkSlider.setLowerLinLimit(linDepth);
		forkSlider.setUpperLinLimit(linDepth);
	}
}
static public void do_move() {
	vehicle.applyEngineForce(gEngineForce, 2);
	vehicle.applyEngineForce(gEngineForce, 3);
	vehicle.setSteeringValue(gVehicleSteering, 0);
	vehicle.setSteeringValue(gVehicleSteering, 1);
}
static public void setAngLimit0(SliderConstraint v) {
	v.setLowerAngLimit(-LIFT_EPS);
	v.setUpperAngLimit(LIFT_EPS);
}
static public void setAngLimit0(HingeConstraint v) {
	v.setLimit(-LIFT_EPS, LIFT_EPS);
}
///a very basic camera following the vehicle
static public void updateCamera() {
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();

	Transform chassisWorldTrans = new Transform();

	// look at the vehicle
	carChassis.getMotionState().getWorldTransform(chassisWorldTrans);
	camTargetPos.set(chassisWorldTrans.origin);

	// interpolate the camera height
	camPos.y = (15.0f*camPos.y + camTargetPos.y + cameraHeight) / 16.0f;

	Vector3f camToObject = new Vector3f();
	camToObject.sub(camTargetPos, camPos);

	// keep distance between min and max distance
	float cameraDistance = camToObject.length();
	float correctionFactor = 0f;
	if (cameraDistance < minCameraDistance) correctionFactor = 0.15f*(minCameraDistance-cameraDistance)/cameraDistance;
	if (cameraDistance > maxCameraDistance) correctionFactor = 0.15f*(maxCameraDistance-cameraDistance)/cameraDistance;
	Vector3f t = new Vector3f();
	t.scale(correctionFactor, camToObject);
	camPos.sub(t);

	// update OpenGL camera settings
	glFrustum(-1.0, 1.0, -1.0, 1.0, 1.0, 10000.0);

	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	
	gluLookAt(camPos.x, camPos.y, camPos.z,
			  camTargetPos.x, camTargetPos.y, camTargetPos.z,
			  0, 1, 0);
}
static public void specialKeyboard(int key, int x, int y, int modifiers) {
	if ((modifiers & KeyEvent.SHIFT_DOWN_MASK) != 0) {
		switch (key) {
			case Keyboard.KEY_LEFT: {
				liftHinge.setLimit(-TAU/2 / 16.0f, TAU/2 / 8.0f);
				liftHinge.enableAngularMotor(true, -0.1f, 10.0f);
				break;
			}
			case Keyboard.KEY_RIGHT: {
				liftHinge.setLimit(-TAU/2 / 16.0f, TAU/2 / 8.0f);
				liftHinge.enableAngularMotor(true, 0.1f, 10.0f);
				break;
			}
			case Keyboard.KEY_UP: {
				forkSlider.setLowerLinLimit(0.1f);
				forkSlider.setUpperLinLimit(3.9f);
				forkSlider.setPoweredLinMotor(true);
				forkSlider.setMaxLinMotorForce(10.0f);
				forkSlider.setTargetLinMotorVelocity(1.0f);
				for (int i = 0; i < 12; i++) {
					l_armSlider[i].setLowerLinLimit(0.1f);
					l_armSlider[i].setUpperLinLimit(3.9f);
					l_armSlider[i].setPoweredLinMotor(true);
					l_armSlider[i].setMaxLinMotorForce(10.0f);
					l_armSlider[i].setTargetLinMotorVelocity(10.0f);
				}
				break;
			}
			case Keyboard.KEY_DOWN: {
				forkSlider.setLowerLinLimit(0.1f);
				forkSlider.setUpperLinLimit(3.9f);
				forkSlider.setPoweredLinMotor(true);
				forkSlider.setMaxLinMotorForce(10.0f);
				forkSlider.setTargetLinMotorVelocity(-1.0f);
				for (int i = 0; i < 12; i++) {
					l_armSlider[i].setLowerLinLimit(0.1f);
					l_armSlider[i].setUpperLinLimit(3.9f);
					l_armSlider[i].setPoweredLinMotor(true);
					l_armSlider[i].setMaxLinMotorForce(10.0f);
					l_armSlider[i].setTargetLinMotorVelocity(-10.0f);
				}
				break;
			}
		}
	} else {
		switch (key) {
			case Keyboard.KEY_LEFT: {
				gVehicleSteering += steeringIncrement;
				if (gVehicleSteering > steeringClamp)
					gVehicleSteering = steeringClamp;
				break;
			}
			case Keyboard.KEY_RIGHT: {
				gVehicleSteering -= steeringIncrement;
				if (gVehicleSteering < -steeringClamp)
					gVehicleSteering = -steeringClamp;
				break;
			}
			case Keyboard.KEY_UP: {
				gEngineForce = 1000;
				break;
			}
			case Keyboard.KEY_DOWN: {
				gEngineForce = -1000;
				break;
			}
		}

	}
	//glutPostRedisplay();
}
static public void renderme() {
	updateCamera();

	CylinderShapeX wheelShape = new CylinderShapeX(new Vector3f(wheelWidth,wheelRadius,wheelRadius));
	Vector3f wheelColor = new Vector3f(1,0,0);

	Vector3f worldBoundsMin = new Vector3f(),worldBoundsMax = new Vector3f();
	dynamicsWorld.getBroadphase().getBroadphaseAabb(worldBoundsMin,worldBoundsMax);

	for (int i=0;i<vehicle.getNumWheels();i++) {
		// synchronize the wheels with the (interpolated) chassis worldtransform
		vehicle.updateWheelTransform(i,true);
		// draw wheels (cylinders)
		Transform trans = vehicle.getWheelInfo(i).worldTransform;
		drawOpenGL(trans,wheelShape,wheelColor/*,worldBoundsMin,worldBoundsMax*/);
	}
	
	super_renderme();
}
static public void initPhysics() {
	{
		DefaultCollisionConfiguration t = new DefaultCollisionConfiguration();
		// original comments include option of using `new AxisSweep3(worldMin,worldMax)` instead of `new DbvtBroadphase()` with min and max being new Vector3f(-1000,-1000,-1000) and new Vector3f(1000,1000,1000)
		dynamicsWorld = new DiscreteDynamicsWorld(new CollisionDispatcher(t), new DbvtBroadphase(), new SequentialImpulseConstraintSolver(), t);
	} { //make the ground
		// either use heightfield or triangle mesh
		final float TRIANGLE_SIZE=20f;

		// create a triangle-mesh ground
		int vertStride = 3*4;
		int indexStride = 3*4;

		final int NUM_VERTS_X = 20;
		final int NUM_VERTS_Y = 20;
		final int totalVerts = NUM_VERTS_X*NUM_VERTS_Y;

		final int totalTriangles = 2*(NUM_VERTS_X-1)*(NUM_VERTS_Y-1);
	
		ByteBuffer vertices = ByteBuffer.allocateDirect(totalVerts*vertStride).order(ByteOrder.nativeOrder());
		ByteBuffer gIndices = ByteBuffer.allocateDirect(totalTriangles*3*4).order(ByteOrder.nativeOrder());

		for (int i=0;i<NUM_VERTS_X;i++) {
			for (int j=0;j<NUM_VERTS_Y;j++) {
				float wl = 0.2f;
				// height set to zero, but can also use curved landscape, just uncomment out the code
				float height = 0.f;//20.f*sinf(float(i)*wl)*cosf(float(j)*wl);
				int idx = (i+j*NUM_VERTS_X)*3*4;
				vertices.putFloat(idx+0*4, (i-NUM_VERTS_X*0.5f)*TRIANGLE_SIZE);
				vertices.putFloat(idx+1*4, height);
				vertices.putFloat(idx+2*4, (j-NUM_VERTS_Y*0.5f)*TRIANGLE_SIZE);
			}
		}

		//int index=0;
		for (int i=0;i<NUM_VERTS_X-1;i++) {
			for (int j=0;j<NUM_VERTS_Y-1;j++) {
				gIndices.putInt(j*NUM_VERTS_X+i);
				gIndices.putInt(j*NUM_VERTS_X+i+1);
				gIndices.putInt((j+1)*NUM_VERTS_X+i+1);

				gIndices.putInt(j*NUM_VERTS_X+i);
				gIndices.putInt((j+1)*NUM_VERTS_X+i+1);
				gIndices.putInt((j+1)*NUM_VERTS_X+i);
			}
		}
		gIndices.flip();

		//localCreateRigidBody(0,trAt(0,-4.5f,0),new BoxShape(new Vector3f(50,3,50)));
		//localCreateRigidBody(0,trAt(0,-4.5f,0),new BvhTriangleMeshShape(new TriangleIndexVertexArray(totalTriangles,gIndices,indexStride,totalVerts,vertices,vertStride), true));
	} {
		CompoundShape t = new CompoundShape();
		// effectively shifts the center of mass with respect to the chassis
		t.addChildShape(trAt(0,1,0), new BoxShape(new Vector3f(1.f,0.5f,2.f))); //chassis
		// effectively shifts the center of mass with respect to the chassis
		t.addChildShape(trAt(0f,1.0f,2.5f), new BoxShape(new Vector3f(0.5f,0.1f,0.5f)));
		carChassis = localCreateRigidBody(800,trAt(0,0,0),t);
		//m_carChassis->setDamping(0.2,0.2);
	}
	liftBody = localCreateRigidBody(10,trAt(0.0f, 2.5f, 3.05f), new BoxShape(new Vector3f(0.5f,2.0f,0.05f)));

	Transform localA = new Transform(), localB = new Transform();
	localA.setIdentity();
	localB.setIdentity();
	MatrixUtil.setEulerZYX(localA.basis, 0, TAU/4, 0);
	localA.origin.set(0.0f, 1.0f, 3.05f);
	MatrixUtil.setEulerZYX(localB.basis, 0, TAU/4, 0);
	localB.origin.set(0.0f, -1.5f, -0.05f);
	liftHinge = new HingeConstraint(carChassis,liftBody, localA, localB);
	setAngLimit0(liftHinge);
	dynamicsWorld.addConstraint(liftHinge, true);

	CompoundShape forkCompound = new CompoundShape();
	forkCompound.addChildShape(trAt(0,0,0), new BoxShape(new Vector3f(1.0f,0.1f,0.1f)));
	forkCompound.addChildShape(trAt(-0.9f, -0.08f, 0.7f), new BoxShape(new Vector3f(0.1f,0.02f,0.6f)));
	forkCompound.addChildShape(trAt(0.9f, -0.08f, 0.7f), new BoxShape(new Vector3f(0.1f,0.02f,0.6f)));

	forkBody = localCreateRigidBody(5, trAt(0.0f, 0.6f, 3.2f), forkCompound);
	
	for (int i = 0; i < 12; i++) {
		Vector3f t = icosohedronVerticies[i];
		Vector3f t2 = new Vector3f(t); t2.scale(2);
		//Matrix3f r = matrix_look_at(t);
		
		//l_arm[i] = localCreateRigidBody(1, setBasis(trAt(t2), r), new BoxShape(new Vector3f(0.1f, 1f, 0.1f)));
		l_arm[i] = localCreateRigidBody(1, trAt(t2), new BoxShape(new Vector3f(0.1f, 1f, 0.1f)));
		
		localA.setIdentity();
		localB.setIdentity();
		//MatrixUtil.setEulerZYX(localA.basis, r[0], r[1] + TAU/4, r[2]);
		MatrixUtil.setEulerZYX(localA.basis, 0, 0, 0);
		localA.origin.set(0, 0, 0);
		MatrixUtil.setEulerZYX(localB.basis, 0, 0, 0);
		//localB.origin.set(t[0], t[1], t[2]);
		localB.origin.set(0, 0, 0);
		l_armSlider[i] = new SliderConstraint(carChassis, l_arm[i], localA, localB, true);
		l_armSlider[i].setLowerLinLimit(0.1f);
		l_armSlider[i].setUpperLinLimit(0.1f);
		setAngLimit0(l_armSlider[i]);
		//dynamicsWorld.addConstraint(l_armSlider[i], true);
	}
	{
		localA.setIdentity();
		localB.setIdentity();
		MatrixUtil.setEulerZYX(localA.basis, 0, 0, TAU/4);
		localA.origin.set(0.0f, -1.9f, 0.05f);
		MatrixUtil.setEulerZYX(localB.basis, 0, 0, TAU/4);
		localB.origin.set(0.0f, 0.0f, -0.1f);
		forkSlider = new SliderConstraint(liftBody, forkBody, localA, localB, true);
		forkSlider.setLowerLinLimit(0.1f);
		forkSlider.setUpperLinLimit(0.1f);
		setAngLimit0(forkSlider);
		dynamicsWorld.addConstraint(forkSlider, true);
	} { // create vehicle
		VehicleTuning tuning = new VehicleTuning();
		vehicle = new RaycastVehicle(tuning, carChassis, new DefaultVehicleRaycaster(dynamicsWorld));

		// never deactivate the vehicle
		carChassis.setActivationState(CollisionObject.DISABLE_DEACTIVATION);

		dynamicsWorld.addVehicle(vehicle);

		float connectionHeight = 1.2f;

		boolean isFrontWheel=true;

		// choose coordinate system
		vehicle.setCoordinateSystem(rightIndex,upIndex,forwardIndex);

		Vector3f connectionPointCS0 = new Vector3f(CUBE_HALF_EXTENTS-(0.3f*wheelWidth),connectionHeight,2f*CUBE_HALF_EXTENTS-wheelRadius);
		Vector3f wheelDirectionCS0 = new Vector3f(0, -1, 0);
		Vector3f wheelAxleCS = new Vector3f(-1, 0, 0);

		vehicle.addWheel(connectionPointCS0,wheelDirectionCS0,wheelAxleCS,suspensionRestLength,wheelRadius,tuning,isFrontWheel);
		connectionPointCS0 = new Vector3f(-CUBE_HALF_EXTENTS+(0.3f*wheelWidth),connectionHeight,2f*CUBE_HALF_EXTENTS-wheelRadius);

		vehicle.addWheel(connectionPointCS0,wheelDirectionCS0,wheelAxleCS,suspensionRestLength,wheelRadius,tuning,isFrontWheel);
		connectionPointCS0 = new Vector3f(-CUBE_HALF_EXTENTS+(0.3f*wheelWidth),connectionHeight,-2f*CUBE_HALF_EXTENTS+wheelRadius);
		isFrontWheel = false;
		vehicle.addWheel(connectionPointCS0,wheelDirectionCS0,wheelAxleCS,suspensionRestLength,wheelRadius,tuning,isFrontWheel);
		connectionPointCS0 = new Vector3f(CUBE_HALF_EXTENTS-(0.3f*wheelWidth),connectionHeight,-2f*CUBE_HALF_EXTENTS+wheelRadius);
		vehicle.addWheel(connectionPointCS0,wheelDirectionCS0,wheelAxleCS,suspensionRestLength,wheelRadius,tuning,isFrontWheel);

		for (int i=0;i<vehicle.getNumWheels();i++) {
			WheelInfo wheel = vehicle.getWheelInfo(i);
			wheel.suspensionStiffness = 20;
			wheel.wheelsDampingRelaxation = 2.3f;
			wheel.wheelsDampingCompression = 4.4f;
			wheel.frictionSlip = 1000;
			wheel.rollInfluence = 0.1f;
		}
	} { // from BasicDemo
		int ARRAY_SIZE_X = 5;
		int ARRAY_SIZE_Y = 5;
		int ARRAY_SIZE_Z = 5;
	
		int START_POS_X = -5;
		int START_POS_Y = 0;
		int START_POS_Z = -3;

		for (int k = 0; k < ARRAY_SIZE_Y; k++) {
			for (int i = 0; i < ARRAY_SIZE_X; i++) {
				for (int j = 0; j < ARRAY_SIZE_Z; j++) {
					float start_x = START_POS_X - ARRAY_SIZE_X / 2;
					float start_y = START_POS_Y;
					float start_z = START_POS_Z - ARRAY_SIZE_Z / 2;
					CollisionShape cs = new BoxShape(new Vector3f(1, 1, 1));
					localCreateRigidBody(1, trAt(
						2f * i + start_x,
						10f + 2f * k + start_y,
						2f * j + start_z), cs);
				}
			}
		}
	}
}
//}
//============================================================// from Util //============================================================//
//{
static public void drawOpenGL(Transform trans, CollisionShape shape, Vector3f color) {
	ObjectPool<Transform> transformsPool = ObjectPool.get(Transform.class);
	ObjectPool<Vector3f> vectorsPool = ObjectPool.get(Vector3f.class);

	glPushMatrix();
	float[] glMat = new float[16];
	trans.getOpenGLMatrix(glMat);
	glMultMatrix(glMat);

	if (shape.getShapeType() == BroadphaseNativeType.COMPOUND_SHAPE_PROXYTYPE) {
		CompoundShape cs = (CompoundShape)shape;
		Transform childTrans = transformsPool.get();
		for (int i = cs.getNumChildShapes() - 1; i >= 0; i--) {
			cs.getChildTransform(i, childTrans);
			CollisionShape colShape = cs.getChildShape(i);
			drawOpenGL(childTrans, colShape, color);
		}
		transformsPool.release(childTrans);
	}
	else {
		glEnable(GL_COLOR_MATERIAL);
		glColor3f(color.x, color.y, color.z);
		if (shape.isConvex()) {
			ConvexShape convexShape = (ConvexShape)shape;
			
			if (shape.getUserPointer() == null) {
				// create a hull approximation
				ShapeHull hull = new ShapeHull(convexShape);
				hull.buildHull(shape.getMargin());
				convexShape.setUserPointer(hull);
			}
			
			ShapeHull hull = (ShapeHull)shape.getUserPointer();
			
			Vector3f normal = vectorsPool.get();
			Vector3f tmp1 = vectorsPool.get();
			Vector3f tmp2 = vectorsPool.get();

			if (hull.numTriangles () > 0) {
				int index = 0;
				IntArrayList idx = hull.getIndexPointer();
				ObjectArrayList<Vector3f> vtx = hull.getVertexPointer();

				glBegin (GL_TRIANGLES);

				for (int i=0; i<hull.numTriangles (); i++)
				{
					int i1 = index++;
					int i2 = index++;
					int i3 = index++;
					assert(i1 < hull.numIndices () &&
						i2 < hull.numIndices () &&
						i3 < hull.numIndices ());

					int index1 = idx.get(i1);
					int index2 = idx.get(i2);
					int index3 = idx.get(i3);
					assert(index1 < hull.numVertices () &&
						index2 < hull.numVertices () &&
						index3 < hull.numVertices ());

					Vector3f v1 = vtx.getQuick(index1);
					Vector3f v2 = vtx.getQuick(index2);
					Vector3f v3 = vtx.getQuick(index3);
					tmp1.sub(v3, v1);
					tmp2.sub(v2, v1);
					normal.cross(tmp1, tmp2);
					normal.normalize();

					glNormal3f(normal.x,normal.y,normal.z);
					glVertex3f (v1.x, v1.y, v1.z);
					glVertex3f (v2.x, v2.y, v2.z);
					glVertex3f (v3.x, v3.y, v3.z);

				}
				glEnd ();
			}
			
			vectorsPool.release(normal);
			vectorsPool.release(tmp1);
			vectorsPool.release(tmp2);
		}
		if (true) { // useWireframeFallback
			// for polyhedral shapes
			if (shape.isPolyhedral()) {
				PolyhedralConvexShape polyshape = (PolyhedralConvexShape) shape;

				glBegin(GL_LINES);

				Vector3f a = vectorsPool.get(), b = vectorsPool.get();
				for (int i = 0; i < polyshape.getNumEdges(); i++) {
					polyshape.getEdge(i, a, b);

					glVertex3f(a.x, a.y, a.z);
					glVertex3f(b.x, b.y, b.z);
				}
				glEnd();
				
				vectorsPool.release(a);
				vectorsPool.release(b);
			}
		}
		if (shape.isConcave()) {
			ConcaveShape concaveMesh = (ConcaveShape) shape;
			//btVector3 aabbMax(btScalar(1e30),btScalar(1e30),btScalar(1e30));
			//btVector3 aabbMax(100,100,100);//btScalar(1e30),btScalar(1e30),btScalar(1e30));

			//todo pass camera, for some culling
			Vector3f aabbMax = vectorsPool.get();
			aabbMax.set(1e30f, 1e30f, 1e30f);
			Vector3f aabbMin = vectorsPool.get();
			aabbMin.set(-1e30f, -1e30f, -1e30f);

			concaveMesh.processAllTriangles(
				new com.bulletphysics.collision.shapes.TriangleCallback() {
					public void processTriangle(Vector3f[] tri, int partId, int triangleIndex) {
						glBegin(GL_TRIANGLES);
							glColor3f(1, 0, 0); glVertex3f(tri[0].x, tri[0].y, tri[0].z);
							glColor3f(0, 1, 0); glVertex3f(tri[1].x, tri[1].y, tri[1].z);
							glColor3f(0, 0, 1); glVertex3f(tri[2].x, tri[2].y, tri[2].z);
						glEnd();
						}},
				aabbMin,
				aabbMax);
			
			vectorsPool.release(aabbMax);
			vectorsPool.release(aabbMin);
		}
	}
	glPopMatrix();
}
static public void glLight(int light, int pname, float[] params) {
	java.nio.FloatBuffer t = org.lwjgl.BufferUtils.createFloatBuffer(params.length);
	t.put(params).flip();
	org.lwjgl.opengl.GL11.glLight(light, pname, t);
}
static public void glMultMatrix(float[] m) {
	java.nio.FloatBuffer t = org.lwjgl.BufferUtils.createFloatBuffer(16);
	t.put(m).flip();
	org.lwjgl.opengl.GL11.glMultMatrix(t);
}
static public void drawCube(float extent) {
	float radi = extent / 2;
	
	glBegin(GL_QUADS);
		glNormal3f( 1f, 0f, 0f); glVertex3f(+radi,-radi,+radi); glVertex3f(+radi,-radi,-radi); glVertex3f(+radi,+radi,-radi); glVertex3f(+radi,+radi,+radi);
		glNormal3f( 0f, 1f, 0f); glVertex3f(+radi,+radi,+radi); glVertex3f(+radi,+radi,-radi); glVertex3f(-radi,+radi,-radi); glVertex3f(-radi,+radi,+radi);
		glNormal3f( 0f, 0f, 1f); glVertex3f(+radi,+radi,+radi); glVertex3f(-radi,+radi,+radi); glVertex3f(-radi,-radi,+radi); glVertex3f(+radi,-radi,+radi);
		glNormal3f(-1f, 0f, 0f); glVertex3f(-radi,-radi,+radi); glVertex3f(-radi,+radi,+radi); glVertex3f(-radi,+radi,-radi); glVertex3f(-radi,-radi,-radi);
		glNormal3f( 0f,-1f, 0f); glVertex3f(-radi,-radi,+radi); glVertex3f(-radi,-radi,-radi); glVertex3f(+radi,-radi,-radi); glVertex3f(+radi,-radi,+radi);
		glNormal3f( 0f, 0f,-1f); glVertex3f(-radi,-radi,-radi); glVertex3f(-radi,+radi,-radi); glVertex3f(+radi,+radi,-radi); glVertex3f(+radi,-radi,-radi);
	glEnd();
}
static public void drawSphere(float radius, int slices, int stacks) {
	org.lwjgl.util.glu.Sphere sphere = new org.lwjgl.util.glu.Sphere();
	
	sphere.draw(radius, 8, 8);
}
static public void drawCylinder(float radius, float halfHeight, int upAxis) {
	org.lwjgl.util.glu.Cylinder cylinder = new org.lwjgl.util.glu.Cylinder();
	org.lwjgl.util.glu.Disk disk = new org.lwjgl.util.glu.Disk();
	
	glPushMatrix();
	switch (upAxis) {
		case 0:
			glRotatef(-90f, 0.0f, 1.0f, 0.0f);
			glTranslatef(0.0f, 0.0f, -halfHeight);
			break;
		case 1:
			glRotatef(-90.0f, 1.0f, 0.0f, 0.0f);
			glTranslatef(0.0f, 0.0f, -halfHeight);
			break;
		case 2:
			glTranslatef(0.0f, 0.0f, -halfHeight);
			break;
		default: throw new RuntimeException();
	}

	// The gluCylinder subroutine draws a cylinder that is oriented along the z axis. 
	// The base of the cylinder is placed at z = 0; the top of the cylinder is placed at z=height. 
	// Like a sphere, the cylinder is subdivided around the z axis into slices and along the z axis into stacks.
	disk.setDrawStyle(GLU_FILL);
	disk.setNormals(GLU_SMOOTH);
	disk.draw(0, radius, 15, 10);
	
	cylinder.setDrawStyle(GLU_FILL);
	cylinder.setNormals(GLU_SMOOTH);
	cylinder.draw(radius, radius, 2f * halfHeight, 15, 10);
	
	glTranslatef(0f, 0f, 2f * halfHeight);
	glRotatef(-180f, 0f, 1f, 0f);
	disk.draw(0, radius, 15, 10);

	glPopMatrix();
}
static public Transform trAt(float x, float y, float z) {
	Transform r = new Transform();
	r.basis.setIdentity();
	r.origin.set(x, y, z);
	return r;
}
static public Transform trAt(Vector3f vec) {return trAt(vec.x, vec.y, vec.z);}
static public Transform setBasis(Transform k, Matrix3f v) {k.basis.set(v); return k;}

}